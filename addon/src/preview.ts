import type { ProjectAnnotations, Renderer } from "storybook/internal/types";

import { DEFAULT_BASELINE_TARGET, GLOBAL_KEY } from "./constants";
import { withBaseline } from "./withGlobals";

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withBaseline],
  initialGlobals: {
    [GLOBAL_KEY]: DEFAULT_BASELINE_TARGET,
  },
};

export default preview;
