import React from "react";
import { styled } from "storybook/theming";

import { BADGE_ELEMENT_ID } from "../constants";
import type { BaselineStatusSummary } from "../types";

const Wrapper = styled.div(({ theme }) => {
  const layoutMargin = theme?.layoutMargin ?? 16;
  const borderRadius = theme?.appBorderRadius ?? 4;
  const borderColor = theme?.appBorderColor ?? "rgba(0, 0, 0, 0.1)";
  const backgroundColor =
    theme?.background?.content ?? theme?.background?.app ?? "#ffffff";
  const textColor = theme?.color?.defaultText ?? "#333333";
  const fontFamily = theme?.typography?.fonts?.base ?? "sans-serif";

  return {
    display: "flex",
    alignItems: "center",
    gap: layoutMargin,
    padding: `${layoutMargin / 2}px ${layoutMargin}px`,
    borderRadius: borderRadius * 2,
    border: `1px solid ${borderColor}`,
    backgroundColor,
    color: textColor,
    marginBottom: layoutMargin,
    fontFamily,
    flexWrap: "wrap",
  };
});

const StatusChip = styled.span<{ tone: "positive" | "warning" | "critical" }>(
  ({ theme, tone }) => {
    const tones = {
      positive: {
        background: theme?.color?.positive ?? "#2f9e44",
        color: theme?.color?.lightest ?? "#ffffff",
      },
      warning: {
        background: theme?.color?.warning ?? "#f0b429",
        color: theme?.color?.darkest ?? "#2c1810",
      },
      critical: {
        background: theme?.color?.negative ?? "#e03131",
        color: theme?.color?.lightest ?? "#ffffff",
      },
    } as const;

    const palette = tones[tone];

    return {
      display: "inline-flex",
      alignItems: "center",
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1,
      padding: "6px 10px",
      borderRadius: 999,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      backgroundColor: palette.background,
      color: palette.color,
    };
  },
);

const Details = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 13,
});

const Note = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme?.color?.mediumdark ?? "#5c5f66",
}));

interface BaselineBadgeProps {
  summary: BaselineStatusSummary | null;
  target: string;
  annotatedCount: number;
  detectedCount: number;
  source: "manual" | "auto" | "none";
}

function getBadgeCopy(
  summary: BaselineStatusSummary | null,
  target: string,
  annotatedCount: number,
  detectedCount: number,
  source: "manual" | "auto" | "none",
): {
  label: string;
  tone: "positive" | "warning" | "critical";
  detail: string;
  hint?: string;
} {
  if (source === "none") {
    return {
      label: "Baseline target not set",
      tone: "warning",
      detail:
        "Add `parameters.baseline.features` or enable auto detection to calculate compatibility.",
      hint: "Provide manual annotations or CSS for automatic analysis.",
    };
  }

  if (source === "auto" && detectedCount > 0) {
    return {
      label: `Baseline ${target}`,
      tone: "warning",
      detail: `${detectedCount} feature${detectedCount === 1 ? "" : "s"} detected automatically. Verify results before relying on them.`,
      hint: "Add manual annotations for authoritative Baseline reporting.",
    };
  }

  if (!summary) {
    return {
      label: `Baseline ${target}`,
      tone: "warning",
      detail: "Unable to compute Baseline summary for the annotated features.",
    };
  }

  if (summary.nonCompliantCount === 0) {
    return {
      label: `Baseline ${summary.target}`,
      tone: "positive",
      detail: `${summary.totalCount} feature${summary.totalCount === 1 ? "" : "s"} meet the Baseline target.`,
    };
  }

  return {
    label: "Not Baseline",
    tone: "critical",
    detail: `${summary.nonCompliantCount} of ${summary.totalCount} feature${summary.totalCount === 1 ? "" : "s"} fall outside Baseline ${summary.target}.`,
    hint: "Consider fallbacks or relaxing the Baseline target for this component.",
  };
}

export const BaselineBadge: React.FC<BaselineBadgeProps> = ({
  summary,
  target,
  annotatedCount,
  detectedCount,
  source,
}) => {
  const copy = getBadgeCopy(summary, target, annotatedCount, detectedCount, source);

  return (
    <Wrapper id={BADGE_ELEMENT_ID}>
      <StatusChip tone={copy.tone}>{copy.label}</StatusChip>
      <Details>
        <span>{copy.detail}</span>
        {copy.hint ? <Note>{copy.hint}</Note> : null}
      </Details>
    </Wrapper>
  );
};
