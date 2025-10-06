import React, { useState } from "react";
import { styled } from "storybook/theming";
import { ChevronDownIcon, ChevronRightIcon, CopyIcon } from "@storybook/icons";

import type { BaselineFeatureUsage } from "../types";

interface CompatibilityMatrixProps {
  features: BaselineFeatureUsage[];
}

const MatrixContainer = styled.div(({ theme }) => ({
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  background: theme.background.content,
  overflow: "hidden",
}));

const MatrixHeader = styled.div(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `${theme.layoutMargin / 2}px ${theme.layoutMargin}px`,
  background: theme.background.hoverable,
  borderBottom: `1px solid ${theme.appBorderColor}`,
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    background: theme.background.app,
  },
}));

const MatrixTitle = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 600,
});

const CopyButton = styled.button(({ theme }) => ({
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
  padding: "4px 8px",
  fontSize: 11,
  cursor: "pointer",
  background: theme.background.content,
  color: theme.color.defaultText,
  display: "flex",
  alignItems: "center",
  gap: 4,
  "&:hover": {
    background: theme.background.hoverable,
  },
}));

const MatrixContent = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  overflowX: "auto",
}));

const MatrixTable = styled.table(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12,
  "th, td": {
    padding: "8px 12px",
    textAlign: "center",
    borderBottom: `1px solid ${theme.appBorderColor}`,
  },
  th: {
    fontWeight: 600,
    background: theme.background.hoverable,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  "td:first-of-type": {
    textAlign: "left",
    fontWeight: 500,
    maxWidth: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

const SupportCell = styled.td<{ status: "supported" | "partial" | "unsupported" }>(
  ({ theme, status }) => {
    const colors = {
      supported: theme.color.positive,
      partial: theme.color.warning,
      unsupported: theme.color.negative,
    };

    return {
      backgroundColor: `${colors[status]}20`,
      color: colors[status],
      fontWeight: 600,
    };
  },
);

const BrowserIcon = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
});

const BROWSERS = [
  { id: "chrome", name: "Chrome", icon: "🌐" },
  { id: "edge", name: "Edge", icon: "🔷" },
  { id: "firefox", name: "Firefox", icon: "🦊" },
  { id: "safari", name: "Safari", icon: "🧭" },
  { id: "chrome_android", name: "Chrome Android", icon: "📱" },
  { id: "safari_ios", name: "Safari iOS", icon: "📱" },
];

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({
  features,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyAsMarkdown = () => {
    let markdown = "| Feature | " + BROWSERS.map((b) => b.name).join(" | ") + " |\n";
    markdown += "|" + "---|".repeat(BROWSERS.length + 1) + "\n";

    features.forEach((feature) => {
      const row = [feature.name];
      BROWSERS.forEach((browser) => {
        const version = getBrowserVersion(feature, browser.id);
        row.push(version || "❌");
      });
      markdown += "| " + row.join(" | ") + " |\n";
    });

    navigator.clipboard.writeText(markdown);
  };

  const getBrowserVersion = (feature: BaselineFeatureUsage, browserId: string): string | null => {
    // This is a simplified version - in production, you'd fetch from web-features
    // For now, we'll show placeholder data
    if (feature.support === "widely") {
      return "✅";
    }
    if (feature.support === "newly") {
      return "⚠️";
    }
    return null;
  };

  const getSupportStatus = (
    feature: BaselineFeatureUsage,
    browserId: string,
  ): "supported" | "partial" | "unsupported" => {
    const version = getBrowserVersion(feature, browserId);
    if (version === "✅") return "supported";
    if (version === "⚠️") return "partial";
    return "unsupported";
  };

  return (
    <MatrixContainer>
      <MatrixHeader onClick={() => setIsExpanded(!isExpanded)}>
        <MatrixTitle>
          {isExpanded ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
          Browser Compatibility Matrix
        </MatrixTitle>
        {isExpanded && (
          <CopyButton
            onClick={(e) => {
              e.stopPropagation();
              handleCopyAsMarkdown();
            }}
          >
            <CopyIcon size={12} />
            Copy as Markdown
          </CopyButton>
        )}
      </MatrixHeader>

      {isExpanded && (
        <MatrixContent>
          <MatrixTable>
            <thead>
              <tr>
                <th>Feature</th>
                {BROWSERS.map((browser) => (
                  <th key={browser.id}>
                    <BrowserIcon>
                      <span>{browser.icon}</span>
                      <span>{browser.name}</span>
                    </BrowserIcon>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.featureId}>
                  <td title={feature.featureId}>{feature.name}</td>
                  {BROWSERS.map((browser) => {
                    const version = getBrowserVersion(feature, browser.id);
                    const status = getSupportStatus(feature, browser.id);
                    return (
                      <SupportCell
                        key={browser.id}
                        status={status}
                        title={version || "Not supported"}
                      >
                        {version || "❌"}
                      </SupportCell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </MatrixTable>
        </MatrixContent>
      )}
    </MatrixContainer>
  );
};
