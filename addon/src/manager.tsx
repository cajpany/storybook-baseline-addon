import React from "react";
import { addons, types } from "storybook/manager-api";

import { Panel } from "./components/Panel";
import { Tool } from "./components/Tool";
import { ADDON_ID, PANEL_ID, TOOL_ID } from "./constants";

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Baseline",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active = false }) => <Panel active={active} />,
  });

  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Baseline Target",
    match: ({ viewMode }) => viewMode === "story",
    render: () => <Tool />,
  });
});
