import postcss, { type Declaration, type AtRule, type Rule } from "postcss";

import featuresData from "web-features/data.json";

import type { BaselineFeatureUsage } from "../types";

export interface ParsedCssFeature {
  type: "declaration" | "at-rule" | "selector";
  name: string;
  params?: string;
  value?: string;
  loc?: {
    source?: string;
    line?: number;
    column?: number;
  };
}

export interface CssAnalyzerResult {
  source: string;
  features: ParsedCssFeature[];
}

export interface CssAnalyzerOptions {
  sourcePath: string;
}

export async function parseCss(
  cssContent: string,
  options: CssAnalyzerOptions,
): Promise<CssAnalyzerResult> {
  const processor = postcss();
  const result = await processor.process(cssContent, {
    from: options.sourcePath,
  });

  const features: ParsedCssFeature[] = [];

  result.root.walk((node) => {
    if (node.type === "decl") {
      features.push(extractFromDeclaration(node));
      return;
    }

    if (node.type === "atrule") {
      features.push(extractFromAtRule(node));
      return;
    }

    if (node.type === "rule") {
      features.push(...extractFromRule(node));
    }
  });

  return {
    source: options.sourcePath,
    features,
  };
}

function extractFromDeclaration(decl: Declaration): ParsedCssFeature {
  return {
    type: "declaration",
    name: decl.prop,
    value: decl.value,
    loc: getLocation(decl),
  };
}

function extractFromAtRule(atrule: AtRule): ParsedCssFeature {
  return {
    type: "at-rule",
    name: atrule.name,
    params: atrule.params,
    loc: getLocation(atrule),
  };
}

function extractFromRule(rule: Rule): ParsedCssFeature[] {
  const selector = rule.selector ?? "";

  return [
    {
      type: "selector",
      name: selector,
      loc: getLocation(rule),
    },
  ];
}

function getLocation(
  node: Declaration | AtRule | Rule,
): ParsedCssFeature["loc"] {
  return {
    source: node.source?.input.file,
    line: node.source?.start?.line,
    column: node.source?.start?.column,
  };
}

export function toFeatureUsages(
  parsed: CssAnalyzerResult,
): BaselineFeatureUsage[] {
  const detected = new Set<string>();

  for (const feature of parsed.features) {
    const featureId = mapFeatureToBaselineId(feature);
    if (featureId && isKnownFeature(featureId)) {
      detected.add(featureId);
    }
  }

  return Array.from(detected).map((featureId) => ({
    featureId,
    support: "not",
    name: getFeatureName(featureId),
    browsers: [],
    baseline: null,
    found: true,
  }));
}

type FeatureMappingRule = (feature: ParsedCssFeature) => string | null;

interface FeatureRegistryEntry {
  kind?: string;
  name?: string | null;
}

const featureRegistry = (featuresData as { features: Record<string, FeatureRegistryEntry> })
  .features;

const DECLARATION_FEATURES: Record<string, string> = {
  "container": "container-queries",
  "container-type": "container-queries",
  "container-name": "container-queries",
  "font-size-adjust": "font-size-adjust",
  "font-variant-alternates": "font-variant-alternates",
  "backdrop-filter": "backdrop-filter",
};

const AT_RULE_FEATURES: Record<string, string> = {
  "container": "container-queries",
  "supports": "supports",
  "layer": "cascade-layers",
};

const declarationRules: FeatureMappingRule[] = [
  (feature) => DECLARATION_FEATURES[feature.name.toLowerCase()] ?? null,
  (feature) => {
    if (feature.name.toLowerCase() === "display") {
      const value = feature.value?.toLowerCase() ?? "";
      if (value.includes("grid")) {
        return "grid";
      }
      if (value.includes("flex")) {
        return "flexbox";
      }
    }
    return null;
  },
  (feature) => {
    if (feature.name.toLowerCase() === "position") {
      const value = feature.value?.toLowerCase() ?? "";
      if (value.includes("sticky")) {
        return "sticky-positioning";
      }
    }
    return null;
  },
  (feature) => {
    const value = feature.value?.toLowerCase() ?? "";
    if (value.includes("subgrid")) {
      return "subgrid";
    }
    return null;
  },
];

const atRuleRules: FeatureMappingRule[] = [
  (feature) => AT_RULE_FEATURES[feature.name.toLowerCase()] ?? null,
];

const selectorRules: FeatureMappingRule[] = [
  (feature) => {
    const selector = feature.name.toLowerCase();
    if (selector.includes(":has(")) {
      return "has";
    }
    return null;
  },
  (feature) => {
    const selector = feature.name.toLowerCase();
    if (selector.includes(":is(")) {
      return "is";
    }
    return null;
  },
  (feature) => {
    const selector = feature.name.toLowerCase();
    if (selector.includes(":where(")) {
      return "where";
    }
    return null;
  },
];

const RULES_BY_TYPE: Record<ParsedCssFeature["type"], FeatureMappingRule[]> = {
  "declaration": declarationRules,
  "at-rule": atRuleRules,
  "selector": selectorRules,
};

function mapFeatureToBaselineId(feature: ParsedCssFeature): string | null {
  const rules = RULES_BY_TYPE[feature.type];
  if (!rules) {
    return null;
  }

  for (const rule of rules) {
    const result = rule(feature);
    if (result) {
      return result;
    }
  }

  return null;
}

function isKnownFeature(featureId: string): boolean {
  const entry = featureRegistry[featureId];
  return Boolean(entry && entry.kind === "feature");
}

function getFeatureName(featureId: string): string {
  const entry = featureRegistry[featureId];
  return entry?.name ?? featureId;
}
