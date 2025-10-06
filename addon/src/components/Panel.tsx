import React, { memo, useMemo, useState } from "react";
import { AddonPanel } from "storybook/internal/components";
import { Placeholder } from "storybook/internal/components";
import { useChannel } from "storybook/manager-api";
import { styled, useTheme } from "storybook/theming";
import { SearchIcon, CloseIcon, DownloadIcon } from "@storybook/icons";

import { EVENTS } from "../constants";
import type { BaselineFeatureUsage, BaselineSummaryEventPayload } from "../types";
import { CompatibilityMatrix } from "./CompatibilityMatrix";
import { WarningBanner } from "./WarningBanner";
import {
  prepareExportData,
  exportAsJSON,
  exportAsCSV,
  exportAsHTML,
  downloadFile,
  copyToClipboard,
} from "../utils/exportHelpers";

interface PanelProps {
  active: boolean;
}

const PanelLayout = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  display: "flex",
  flexDirection: "column",
  gap: theme.layoutMargin,
}));

const FilterBar = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.layoutMargin / 2,
  alignItems: "center",
  padding: `${theme.layoutMargin / 2}px ${theme.layoutMargin}px`,
  background: theme.background.content,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
}));

const SearchInput = styled.input(({ theme }) => ({
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 13,
  color: theme.color.defaultText,
  padding: "6px 8px",
  "::placeholder": {
    color: theme.color.mediumdark,
  },
}));

const FilterButton = styled.button<{ active?: boolean }>(({ theme, active }) => ({
  border: `1px solid ${active ? theme.color.secondary : theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  background: active ? theme.color.secondary : theme.background.content,
  color: active ? theme.color.lightest : theme.color.defaultText,
  transition: "all 0.2s ease",
  "&:hover": {
    background: active ? theme.color.secondary : theme.background.hoverable,
  },
}));

const ClearButton = styled.button(({ theme }) => ({
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 4,
  display: "flex",
  alignItems: "center",
  color: theme.color.mediumdark,
  "&:hover": {
    color: theme.color.defaultText,
  },
}));

const ResultCount = styled.div(({ theme }) => ({
  fontSize: 12,
  color: theme.color.mediumdark,
  padding: `0 ${theme.layoutMargin}px`,
}));

const ExportMenu = styled.div(({ theme }) => ({
  position: "relative",
  display: "inline-block",
}));

const ExportButton = styled.button(({ theme }) => ({
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  background: theme.background.content,
  color: theme.color.defaultText,
  display: "flex",
  alignItems: "center",
  gap: 6,
  "&:hover": {
    background: theme.background.hoverable,
  },
}));

const ExportDropdown = styled.div(({ theme }) => ({
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: 4,
  background: theme.background.content,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 1000,
  minWidth: 180,
}));

const ExportOption = styled.button(({ theme }) => ({
  width: "100%",
  border: "none",
  background: "transparent",
  padding: "10px 16px",
  fontSize: 13,
  textAlign: "left",
  cursor: "pointer",
  color: theme.color.defaultText,
  "&:hover": {
    background: theme.background.hoverable,
  },
  "&:first-of-type": {
    borderTopLeftRadius: theme.appBorderRadius,
    borderTopRightRadius: theme.appBorderRadius,
  },
  "&:last-of-type": {
    borderBottomLeftRadius: theme.appBorderRadius,
    borderBottomRightRadius: theme.appBorderRadius,
  },
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
  const [payload, setPayload] = useState<BaselineSummaryEventPayload | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [supportFilter, setSupportFilter] = useState<"all" | "widely" | "newly" | "not">("all");
  const [showOnlyNonBaseline, setShowOnlyNonBaseline] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const filteredFeatures = useMemo(() => {
    if (!summary?.features) {
      return [];
    }

    let filtered = summary.features;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (feature) =>
          feature.name.toLowerCase().includes(query) ||
          feature.featureId.toLowerCase().includes(query),
      );
    }

    // Support level filter
    if (supportFilter !== "all") {
      filtered = filtered.filter((feature) => feature.support === supportFilter);
    }

    // Non-Baseline filter
    if (showOnlyNonBaseline) {
      filtered = filtered.filter((feature) => feature.support === "not");
    }

    return filtered;
  }, [summary?.features, searchQuery, supportFilter, showOnlyNonBaseline]);

  const hasActiveFilters = searchQuery.trim() !== "" || supportFilter !== "all" || showOnlyNonBaseline;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSupportFilter("all");
    setShowOnlyNonBaseline(false);
  };

  const warningKey = `${payload?.storyId}-nonbaseline`;
  const shouldShowWarning = 
    summary && 
    summary.nonCompliantCount > 0 && 
    !dismissedWarnings.has(warningKey);

  const handleDismissWarning = () => {
    setDismissedWarnings(new Set(dismissedWarnings).add(warningKey));
  };

  const handleExport = (format: "json" | "csv" | "html" | "copy") => {
    if (!payload) return;

    const exportData = prepareExportData(payload);
    const storyName = payload.storyId.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const timestamp = new Date().toISOString().split("T")[0];

    switch (format) {
      case "json": {
        const content = exportAsJSON(exportData);
        downloadFile(content, `baseline-${storyName}-${timestamp}.json`, "application/json");
        break;
      }
      case "csv": {
        const content = exportAsCSV(exportData);
        downloadFile(content, `baseline-${storyName}-${timestamp}.csv`, "text/csv");
        break;
      }
      case "html": {
        const content = exportAsHTML(exportData);
        downloadFile(content, `baseline-${storyName}-${timestamp}.html`, "text/html");
        break;
      }
      case "copy": {
        const content = exportAsJSON(exportData);
        copyToClipboard(content).catch((err) => {
          console.error("Failed to copy to clipboard:", err);
        });
        break;
      }
    }

    setShowExportMenu(false);
  };

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
    <AddonPanel active={active} data-panel-id="baseline">
      <PanelLayout>
        <SummaryRow>
          <div>
            <strong>{statusCopy.headline}</strong>
            <div style={{ color: theme.color.mediumdark, fontSize: 12 }}>
              {statusCopy.subline}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {payload && (
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
            )}
            {payload && summary && (
              <ExportMenu>
                <ExportButton onClick={() => setShowExportMenu(!showExportMenu)}>
                  <DownloadIcon size={14} />
                  Export
                </ExportButton>
                {showExportMenu && (
                  <ExportDropdown>
                    <ExportOption onClick={() => handleExport("json")}>
                      Export as JSON
                    </ExportOption>
                    <ExportOption onClick={() => handleExport("csv")}>
                      Export as CSV
                    </ExportOption>
                    <ExportOption onClick={() => handleExport("html")}>
                      Export as HTML
                    </ExportOption>
                    <ExportOption onClick={() => handleExport("copy")}>
                      Copy JSON to Clipboard
                    </ExportOption>
                  </ExportDropdown>
                )}
              </ExportMenu>
            )}
          </div>
        </SummaryRow>

        {shouldShowWarning && (
          <WarningBanner
            severity={summary.nonCompliantCount === summary.totalCount ? "error" : "warning"}
            message={`${summary.nonCompliantCount} feature${summary.nonCompliantCount === 1 ? "" : "s"} do not meet Baseline ${summary.target}`}
            details={`Consider adding fallbacks or adjusting your Baseline target. ${featureSource === "auto" ? "These features were auto-detected from CSS." : ""}`}
            onDismiss={handleDismissWarning}
            dismissible={true}
          />
        )}

        {summary && summary.features.length > 0 && (
          <FilterBar>
            <SearchIcon size={14} />
            <SearchInput
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FilterButton
              active={supportFilter === "widely"}
              onClick={() => setSupportFilter(supportFilter === "widely" ? "all" : "widely")}
            >
              Widely
            </FilterButton>
            <FilterButton
              active={supportFilter === "newly"}
              onClick={() => setSupportFilter(supportFilter === "newly" ? "all" : "newly")}
            >
              Newly
            </FilterButton>
            <FilterButton
              active={supportFilter === "not"}
              onClick={() => setSupportFilter(supportFilter === "not" ? "all" : "not")}
            >
              Not
            </FilterButton>
            <FilterButton
              active={showOnlyNonBaseline}
              onClick={() => setShowOnlyNonBaseline(!showOnlyNonBaseline)}
            >
              Non-Baseline Only
            </FilterButton>
            {hasActiveFilters && (
              <ClearButton onClick={handleClearFilters} title="Clear filters">
                <CloseIcon size={14} />
              </ClearButton>
            )}
          </FilterBar>
        )}

        {hasActiveFilters && (
          <ResultCount>
            Showing {filteredFeatures.length} of {summary?.features.length ?? 0} features
          </ResultCount>
        )}

        {summary && summary.features.length > 0 && (
          <CompatibilityMatrix features={filteredFeatures.length > 0 ? filteredFeatures : summary.features} />
        )}

        {summary && filteredFeatures.length > 0 ? (
          <FeatureTable>
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Feature</th>
                <th style={{ width: "20%" }}>Baseline status</th>
                <th style={{ width: "30%" }}>Browsers</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeatures.map((feature) => (
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
        ) : summary && summary.features.length > 0 && filteredFeatures.length === 0 ? (
          <Placeholder>
            No features match your filters. <a onClick={handleClearFilters} style={{ cursor: "pointer", textDecoration: "underline" }}>Clear filters</a>
          </Placeholder>
        ) : (
          <Placeholder>
            No Baseline data yet. Annotate features or adjust the target.
          </Placeholder>
        )}
      </PanelLayout>
    </AddonPanel>
  );
});
