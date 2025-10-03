import postcss, { type Declaration, type AtRule, type Rule } from "postcss";

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
  return parsed.features.map((feature) => ({
    featureId: feature.name,
    support: "not",
    name: feature.name,
    browsers: [],
    baseline: null,
    found: true,
  }));
}
