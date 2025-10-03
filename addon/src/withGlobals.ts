import React, { useEffect, useMemo } from "react";
import { addons } from "storybook/preview-api";
import type {
  Renderer,
  StoryContext,
  PartialStoryFn as StoryFunction,
} from "storybook/internal/types";

import { computeBaselineSummary } from "./baseline";
import { BaselineBadge } from "./components/BaselineBadge";
import {
  DEFAULT_BASELINE_TARGET,
  EVENTS,
  GLOBAL_KEY,
  PARAM_KEY,
} from "./constants";
import type {
  BaselineStoryParameters,
  BaselineSummaryEventPayload,
} from "./types";

export const withBaseline = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>,
) => {
  const parameters = (context.parameters?.[PARAM_KEY] ?? {}) as
    | BaselineStoryParameters
    | undefined;
  const annotatedFeatures = Array.isArray(parameters?.features)
    ? parameters!.features.filter((value): value is string => typeof value === "string")
    : [];

  const featuresKey = annotatedFeatures.join("|");

  const globalTarget =
    typeof context.globals?.[GLOBAL_KEY] === "string"
      ? (context.globals[GLOBAL_KEY] as string)
      : undefined;

  const target = parameters?.target ?? globalTarget ?? DEFAULT_BASELINE_TARGET;

  const summary = useMemo(() => {
    if (annotatedFeatures.length === 0) {
      return null;
    }
    return computeBaselineSummary(annotatedFeatures, target);
  }, [featuresKey, target]);

  const payload = useMemo<BaselineSummaryEventPayload>(
    () => ({
      storyId: context.id,
      target,
      annotatedCount: annotatedFeatures.length,
      features: annotatedFeatures,
      summary,
    }),
    [context.id, target, featuresKey, summary],
  );

  useEffect(() => {
    const channel = addons.getChannel();
    channel.emit(EVENTS.SUMMARY, payload);
  }, [payload]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(BaselineBadge, {
      summary,
      target,
      annotatedCount: annotatedFeatures.length,
    }),
    StoryFn(),
  );
};
