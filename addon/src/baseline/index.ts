import featuresData from "web-features/data.json";

import type {
  BaselineFeatureUsage,
  BaselineRawStatus,
  BaselineStatusSummary,
} from "../types";

type WebFeatureEntry = {
  kind?: string;
  status?: {
    baseline?: "high" | "low" | false | null;
    support?: Record<string, string>;
  } | null;
  name?: string | null;
  description?: string | null;
};

const TARGET_THRESHOLDS: Record<string, "high" | "low"> = {
  "2025": "high",
  "2024": "high",
  "widely": "high",
  "widely-available": "high",
  "2023": "low",
  "2022": "low",
  newly: "low",
  "newly-available": "low",
};

const DEFAULT_THRESHOLD: "high" | "low" = "high";

function isFeatureEntry(value: unknown): value is WebFeatureEntry {
  return Boolean(value && typeof value === "object");
}

function normalizeTarget(target: string): {
  target: string;
  threshold: "high" | "low";
} {
  const normalized = target.toLowerCase();
  const threshold = TARGET_THRESHOLDS[normalized] ?? DEFAULT_THRESHOLD;

  return { target, threshold };
}

function normalizeBaseline(value: unknown): BaselineRawStatus {
  if (value === "high" || value === "low") {
    return value;
  }
  return null;
}

function toSupportLevel(
  baseline: BaselineRawStatus,
): BaselineFeatureUsage["support"] {
  if (baseline === "high") {
    return "widely";
  }

  if (baseline === "low") {
    return "newly";
  }

  return "not";
}

function meetsTarget(
  baseline: BaselineRawStatus,
  threshold: "high" | "low",
): boolean {
  if (baseline === "high") {
    return true;
  }

  if (baseline === "low") {
    return threshold === "low";
  }

  return false;
}

const features = (featuresData as { features: Record<string, WebFeatureEntry> }).features;

export function computeBaselineSummary(
  featureIds: string[],
  target: string,
): BaselineStatusSummary | null {
  if (!featureIds.length) {
    return null;
  }

  const { target: resolvedTarget, threshold } = normalizeTarget(target);

  const featureSummaries: BaselineFeatureUsage[] = featureIds.map((featureId) => {
    const rawEntry = features[featureId] as unknown;

    if (!isFeatureEntry(rawEntry) || rawEntry.kind !== "feature") {
      return {
        featureId,
        name: featureId,
        support: "not",
        baseline: null,
        browsers: [],
        found: false,
      };
    }

    const baseline = normalizeBaseline(rawEntry.status?.baseline ?? null);
    const support = toSupportLevel(baseline);
    const browsers = rawEntry.status?.support
      ? Object.keys(rawEntry.status.support ?? {})
      : [];

    return {
      featureId,
      name: rawEntry.name ?? featureId,
      support,
      baseline,
      browsers,
      found: true,
      description: rawEntry.description ?? undefined,
    };
  });

  const compliantCount = featureSummaries.filter((feature) =>
    meetsTarget(feature.baseline, threshold),
  ).length;

  const totalCount = featureSummaries.length;
  const nonCompliantCount = totalCount - compliantCount;

  return {
    target: resolvedTarget,
    threshold,
    totalCount,
    compliantCount,
    nonCompliantCount,
    features: featureSummaries,
  };
}
