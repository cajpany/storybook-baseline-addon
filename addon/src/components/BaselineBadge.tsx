import React, { useState } from "react";
import { styled, keyframes } from "storybook/theming";

import { BADGE_ELEMENT_ID } from "../constants";
import type { BaselineStatusSummary } from "../types";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(-4px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const Wrapper = styled.div<{ clickable?: boolean }>(({ theme, clickable }) => {
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
    cursor: clickable ? "pointer" : "default",
    transition: "all 0.2s ease",
    animation: `${fadeIn} 0.3s ease`,
    "&:hover": clickable ? {
      borderColor: theme?.color?.secondary,
      boxShadow: `0 2px 8px ${theme?.color?.secondary}20`,
    } : {},
  };
});

const pulse = keyframes({
  "0%, 100%": { transform: "scale(1)" },
  "50%": { transform: "scale(1.05)" },
});

const StatusChip = styled.span<{ tone: "positive" | "warning" | "critical"; animated?: boolean }>(
  ({ theme, tone, animated }) => {
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
      transition: "all 0.3s ease",
      animation: animated ? `${pulse} 2s ease-in-out infinite` : "none",
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

const FeatureCount = styled.span(({ theme }) => ({
  fontSize: 11,
  fontWeight: 600,
  color: theme?.color?.mediumdark ?? "#5c5f66",
  padding: "2px 6px",
  borderRadius: 999,
  backgroundColor: theme?.background?.hoverable ?? "#f5f5f5",
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
  const [isAnimating, setIsAnimating] = useState(false);
  const copy = getBadgeCopy(summary, target, annotatedCount, detectedCount, source);
  const featureCount = summary?.totalCount ?? annotatedCount + detectedCount;

  const handleClick = () => {
    const panel = document.querySelector('[data-panel-id="baseline"]');
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  };

  return (
    <Wrapper 
      id={BADGE_ELEMENT_ID} 
      clickable={true}
      onClick={handleClick}
      title="Click to view details in Baseline panel"
    >
      <StatusChip tone={copy.tone} animated={isAnimating}>
        {copy.label}
      </StatusChip>
      <Details>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{copy.detail}</span>
          {featureCount > 0 && (
            <FeatureCount title={`${featureCount} feature${featureCount === 1 ? "" : "s"} analyzed`}>
              {featureCount} {featureCount === 1 ? "feature" : "features"}
            </FeatureCount>
          )}
        </div>
        {copy.hint ? <Note>{copy.hint}</Note> : null}
      </Details>
    </Wrapper>
  );
};
