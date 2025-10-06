import React, { memo, useCallback } from "react";
import { useGlobals } from "storybook/manager-api";
import { WithTooltip, TooltipLinkList } from "storybook/internal/components";
import { styled } from "storybook/theming";
import { CheckIcon } from "@storybook/icons";

import { GLOBAL_KEY, DEFAULT_BASELINE_TARGET } from "../constants";

const ToolButton = styled.button(({ theme }) => ({
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 600,
  color: theme.color.defaultText,
  display: "flex",
  alignItems: "center",
  gap: 6,
  "&:hover": {
    background: theme.background.hoverable,
  },
}));

const BASELINE_TARGETS = [
  { id: "2024", title: "Baseline 2024", description: "Widely available" },
  { id: "2023", title: "Baseline 2023", description: "High availability" },
  { id: "2022", title: "Baseline 2022", description: "Legacy support" },
  { id: "widely-available", title: "Widely Available", description: "High baseline" },
  { id: "newly-available", title: "Newly Available", description: "Low baseline" },
];

export const Tool = memo(function BaselineTool() {
  const [globals, updateGlobals] = useGlobals();
  const currentTarget = (globals[GLOBAL_KEY] as string) || DEFAULT_BASELINE_TARGET;

  const handleTargetChange = useCallback(
    (targetId: string) => {
      updateGlobals({
        [GLOBAL_KEY]: targetId,
      });
    },
    [updateGlobals]
  );

  const links = BASELINE_TARGETS.map((target) => ({
    id: target.id,
    title: target.title,
    right: currentTarget === target.id ? <CheckIcon size={14} /> : undefined,
    onClick: () => handleTargetChange(target.id),
  }));

  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      tooltip={<TooltipLinkList links={links} />}
    >
      <ToolButton title="Select Baseline target">
        Baseline: {currentTarget}
      </ToolButton>
    </WithTooltip>
  );
});
