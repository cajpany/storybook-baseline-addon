import React, { memo, useMemo } from "react";
import { AddonPanel } from "storybook/internal/components";
import { Placeholder } from "storybook/internal/components";
import { useChannel } from "storybook/manager-api";
import { styled, useTheme } from "storybook/theming";

import { EVENTS } from "../constants";
import type { BaselineFeatureUsage, BaselineSummaryEventPayload } from "../types";

interface PanelProps {
  active: boolean;
}

const PanelLayout = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  display: "flex",
  flexDirection: "column",
  gap: theme.layoutMargin,
}));

const SummaryRow = styled.div(({ theme }) => ({
  display: "flex",
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  padding: theme.layoutMargin,
  background: theme.background.content,
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.layoutMargin,
}));

const FeatureTable = styled.table(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
  thead: {
    background: theme.background.hoverable,
    textAlign: "left",
  },
  "th, td": {
    padding: `${theme.layoutMargin / 2}px ${theme.layoutMargin}px`,
    borderBottom: `1px solid ${theme.appBorderColor}`,
  },
}));

const SupportBadge = styled.span<{ tone: "positive" | "warning" | "critical" }>(
  ({ theme, tone }) => {
    const palette = {
      positive: theme.color.positive,
      warning: theme.color.warning,
      critical: theme.color.negative,
    } as const;

    return {
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 999,
      padding: "4px 8px",
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      color: theme.color.lightest,
      backgroundColor: palette[tone],
    };
  },
);

const statusTone = (support: BaselineFeatureUsage["support"]):
  | "positive"
  | "warning"
  | "critical" => {
  if (support === "widely") {
    return "positive";
  }
  if (support === "newly") {
    return "warning";
  }
  return "critical";
};

export const Panel: React.FC<PanelProps> = memo(({ active }) => {
  const theme = useTheme();
  const [payload, setPayload] = React.useState<BaselineSummaryEventPayload | null>(
    null,
  );

  useChannel({
    [EVENTS.SUMMARY]: (summary: BaselineSummaryEventPayload) => {
      setPayload(summary);
    },
  });

  const summary = payload?.summary ?? null;
  const featureSource = payload?.source ?? "none";
  const primaryCount = featureSource === "manual"
    ? payload?.annotatedCount ?? 0
    : payload?.detectedCount ?? 0;

  const statusCopy = useMemo(() => {
    if (!payload) {
      return {
        headline: "Baseline analyzer idle",
        subline: "Render a story to populate Baseline data.",
      };
    }

    if (featureSource === "none") {
      return {
        headline: "Awaiting features",
        subline:
          "Add manual annotations or provide CSS for automatic detection to begin analysis.",
      };
    }

    if (!summary) {
      return {
        headline:
          featureSource === "auto"
            ? "Automatic analysis incomplete"
            : "Summary unavailable",
        subline:
          featureSource === "auto"
            ? "Auto-detected CSS could not be parsed. Validate CSS input or add manual annotations."
            : "Unable to compute Baseline data for the supplied features.",
      };
    }

    if (summary.nonCompliantCount === 0) {
      return {
        headline: `Baseline target ${summary.target} met`,
        subline: `${summary.totalCount} feature${summary.totalCount === 1 ? "" : "s"} satisfy the target threshold.`,
      };
    }

    return {
      headline: `Baseline target ${summary.target} not met`,
      subline: `${summary.nonCompliantCount} of ${summary.totalCount} feature${summary.totalCount === 1 ? "" : "s"} fall outside the selected target.`,
    };
  }, [payload, summary]);

  if (!active) {
    return null;
  }

  return (
    <AddonPanel active={active}>
      <PanelLayout>
        <SummaryRow>
          <div>
            <strong>{statusCopy.headline}</strong>
            <div style={{ color: theme.color.mediumdark, fontSize: 12 }}>
              {statusCopy.subline}
            </div>
          </div>
          {payload ? (
            <div style={{ textAlign: "right", minWidth: 160 }}>
              <div style={{ fontWeight: 600, fontSize: 12 }}>Story</div>
              <div style={{ fontSize: 12 }}>{payload.storyId}</div>
              <div style={{ fontSize: 12 }}>
                Target: <strong>{payload.target}</strong>
              </div>
              <div style={{ fontSize: 12 }}>
                Source: <strong>{featureSource}</strong>
              </div>
              <div style={{ fontSize: 12 }}>
                Features considered: <strong>{primaryCount}</strong>
              </div>
            </div>
          ) : null}
        </SummaryRow>

        {summary && summary.features.length > 0 ? (
          <FeatureTable>
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Feature</th>
                <th style={{ width: "20%" }}>Baseline status</th>
                <th style={{ width: "30%" }}>Browsers</th>
              </tr>
            </thead>
            <tbody>
              {summary.features.map((feature) => (
                <tr key={feature.featureId}>
                  <td>
                    <strong>{feature.name}</strong>
                    <div style={{ fontSize: 11, color: theme.color.mediumdark }}>
                      {feature.featureId}
                    </div>
                  </td>
                  <td>
                    <SupportBadge tone={statusTone(feature.support)}>
                      {feature.support}
                    </SupportBadge>
                  </td>
                  <td>{feature.baseline ?? "unknown"}</td>
                  <td style={{ fontSize: 12 }}>
                    {feature.browsers.length
                      ? feature.browsers.join(", ")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </FeatureTable>
        ) : (
          <Placeholder>
            No Baseline data yet. Annotate features or adjust the target.
          </Placeholder>
        )}
      </PanelLayout>
    </AddonPanel>
  );
});
