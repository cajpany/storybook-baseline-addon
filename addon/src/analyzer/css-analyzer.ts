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

export function parseCss(
  cssContent: string,
  options: CssAnalyzerOptions,
): CssAnalyzerResult {
  const root = postcss.parse(cssContent, {
    from: options.sourcePath,
  });

  const features: ParsedCssFeature[] = [];

  root.walk((node) => {
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
  // Container Queries
  "container": "container-queries",
  "container-type": "container-queries",
  "container-name": "container-queries",
  
  // Layout
  "gap": "flexbox-gap",
  "row-gap": "flexbox-gap",
  "column-gap": "flexbox-gap",
  "aspect-ratio": "aspect-ratio",
  "inset": "inset",
  "inset-block": "inset",
  "inset-inline": "inset",
  
  // Typography
  "font-size-adjust": "font-size-adjust",
  "font-variant-alternates": "font-variant-alternates",
  
  // Visual Effects
  "backdrop-filter": "backdrop-filter",
  "mix-blend-mode": "mix-blend-mode",
  "background-blend-mode": "mix-blend-mode",
  
  // Scroll
  "scroll-behavior": "scroll-behavior",
  "scroll-snap-type": "scroll-snap",
  "scroll-snap-align": "scroll-snap",
  "overscroll-behavior": "overscroll-behavior",
  
  // Logical Properties
  "margin-block": "logical-properties",
  "margin-inline": "logical-properties",
  "padding-block": "logical-properties",
  "padding-inline": "logical-properties",
  "border-block": "logical-properties",
  "border-inline": "logical-properties",
  
  // Masking
  "mask": "css-masks",
  "mask-image": "css-masks",
  "clip-path": "css-masks",
  
  // Filters
  "filter": "filters",
  
  // Transforms
  "transform": "transforms2d",
  "transform-origin": "transforms2d",
  "rotate": "individual-transform-properties",
  "scale": "individual-transform-properties",
  "translate": "individual-transform-properties",
};

const AT_RULE_FEATURES: Record<string, string> = {
  "container": "container-queries",
  "supports": "supports",
  "layer": "cascade-layers",
  "property": "at-property",
  "scope": "css-cascade-scope",
  "starting-style": "starting-style",
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
  // CSS Functions
  (feature) => {
    const value = feature.value?.toLowerCase() ?? "";
    if (value.includes("clamp(")) {
      return "css-math-functions";
    }
    if (value.includes("min(") || value.includes("max(")) {
      return "css-math-functions";
    }
    if (value.includes("color-mix(")) {
      return "color-mix";
    }
    if (value.includes("color(")) {
      return "css-color-function";
    }
    if (value.includes("lab(") || value.includes("lch(")) {
      return "lab-colors";
    }
    if (value.includes("oklab(") || value.includes("oklch(")) {
      return "oklab-oklch";
    }
    if (value.includes("hwb(")) {
      return "hwb-colors";
    }
    return null;
  },
  // Nesting indicator (& selector in value)
  (feature) => {
    const value = feature.value?.toLowerCase() ?? "";
    if (value.includes("&")) {
      return "css-nesting";
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
    if (selector.includes(":is(")) {
      return "is";
    }
    if (selector.includes(":where(")) {
      return "where";
    }
    if (selector.includes(":focus-visible")) {
      return "focus-visible";
    }
    if (selector.includes(":focus-within")) {
      return "focus-within";
    }
    if (selector.includes("::backdrop")) {
      return "dialog";
    }
    if (selector.includes("::part(")) {
      return "css-shadow-parts";
    }
    if (selector.includes(":not(")) {
      return "css-not-sel-list";
    }
    if (selector.includes(":nth-child(") && selector.includes("of ")) {
      return "css-nth-child-of";
    }
    // CSS Nesting (& in selector)
    if (selector.includes("&")) {
      return "css-nesting";
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
