import React from "react";
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

interface BaselineDecoratorProps {
  storyFn: StoryFunction<Renderer>;
  context: StoryContext<Renderer>;
}

const channel = addons.getChannel();

const BaselineDecorator: React.FC<BaselineDecoratorProps> = ({
  storyFn,
  context,
}) => {
  const parameters = (context.parameters?.[PARAM_KEY] ?? {}) as
    | BaselineStoryParameters
    | undefined;
  const annotatedFeatures = Array.isArray(parameters?.features)
    ? parameters.features.filter((value): value is string => typeof value === "string")
    : [];

  const globalTarget =
    typeof context.globals?.[GLOBAL_KEY] === "string"
      ? (context.globals[GLOBAL_KEY] as string)
      : undefined;

  const target = parameters?.target ?? globalTarget ?? DEFAULT_BASELINE_TARGET;

  const summary = annotatedFeatures.length
    ? computeBaselineSummary(annotatedFeatures, target)
    : null;

  const storyElement = storyFn(context);

  const payload: BaselineSummaryEventPayload = {
    storyId: context.id,
    target,
    annotatedCount: annotatedFeatures.length,
    features: annotatedFeatures,
    summary,
  };

  channel.emit(EVENTS.SUMMARY, payload);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(BaselineBadge, {
      summary,
      target,
      annotatedCount: annotatedFeatures.length,
    }),
    storyElement,
  );
};

export const withBaseline = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>,
) => React.createElement(BaselineDecorator, { storyFn: StoryFn, context });
