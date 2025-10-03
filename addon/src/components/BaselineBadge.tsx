import React from "react";
import { styled } from "storybook/theming";

import { BADGE_ELEMENT_ID } from "../constants";
import type { BaselineStatusSummary } from "../types";

const Wrapper = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.layoutMargin,
  padding: `${theme.layoutMargin / 2}px ${theme.layoutMargin}px`,
  borderRadius: theme.appBorderRadius * 2,
  border: `1px solid ${theme.appBorderColor}`,
  backgroundColor: theme.background.content,
  color: theme.color.defaultText,
  marginBottom: theme.layoutMargin,
  fontFamily: theme.typography.fonts.base,
  flexWrap: "wrap",
}));

const StatusChip = styled.span<{ tone: "positive" | "warning" | "critical" }>(
  ({ theme, tone }) => {
    const tones = {
      positive: {
        background: theme.color.positive,
        color: theme.color.lightest,
      },
      warning: {
        background: theme.color.warning,
        color: theme.color.darkest,
      },
      critical: {
        background: theme.color.negative,
        color: theme.color.lightest,
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
  color: theme.color.mediumdark,
}));

interface BaselineBadgeProps {
  summary: BaselineStatusSummary | null;
  target: string;
  annotatedCount: number;
}

function getBadgeCopy(
  summary: BaselineStatusSummary | null,
  target: string,
  annotatedCount: number,
): {
  label: string;
  tone: "positive" | "warning" | "critical";
  detail: string;
  hint?: string;
} {
  if (!annotatedCount) {
    return {
      label: "Baseline target not set",
      tone: "warning",
      detail:
        "Add `parameters.baseline.features` to this story to calculate compatibility.",
      hint: "Manual annotations power the Baseline panel during the MVP phase.",
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
}) => {
  const copy = getBadgeCopy(summary, target, annotatedCount);

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
