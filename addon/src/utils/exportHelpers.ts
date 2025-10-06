import type { BaselineFeatureUsage, BaselineSummaryEventPayload } from "../types";

export interface ExportData {
  storyId: string;
  target: string;
  source: "manual" | "auto" | "none";
  annotatedCount: number;
  detectedCount?: number;
  totalFeatures: number;
  compliantFeatures: number;
  nonCompliantFeatures: number;
  features: BaselineFeatureUsage[];
  exportedAt: string;
}

export function prepareExportData(payload: BaselineSummaryEventPayload): ExportData {
  const summary = payload.summary;
  
  return {
    storyId: payload.storyId,
    target: payload.target,
    source: payload.source,
    annotatedCount: payload.annotatedCount,
    detectedCount: payload.detectedCount,
    totalFeatures: summary?.totalCount ?? 0,
    compliantFeatures: summary?.compliantCount ?? 0,
    nonCompliantFeatures: summary?.nonCompliantCount ?? 0,
    features: summary?.features ?? [],
    exportedAt: new Date().toISOString(),
  };
}

export function exportAsJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

export function exportAsCSV(data: ExportData): string {
  const headers = [
    "Feature ID",
    "Feature Name",
    "Support Level",
    "Baseline Status",
    "Browsers",
  ];

  const rows = data.features.map((feature) => [
    feature.featureId,
    feature.name,
    feature.support,
    feature.baseline ?? "unknown",
    feature.browsers.join("; "),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return csvContent;
}

export function exportAsHTML(data: ExportData): string {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Baseline Report - ${data.storyId}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 1200px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      margin: 0 0 8px 0;
      color: #333;
    }
    .meta {
      color: #666;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .summary-card {
      padding: 16px;
      border-radius: 6px;
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
    }
    .summary-card h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .summary-card .value {
      font-size: 32px;
      font-weight: 600;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f9f9f9;
      font-weight: 600;
      color: #333;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-widely {
      background: #d4edda;
      color: #155724;
    }
    .badge-newly {
      background: #fff3cd;
      color: #856404;
    }
    .badge-not {
      background: #f8d7da;
      color: #721c24;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Baseline Compatibility Report</h1>
    <div class="meta">
      <strong>Story:</strong> ${data.storyId}<br>
      <strong>Target:</strong> Baseline ${data.target}<br>
      <strong>Source:</strong> ${data.source}<br>
      <strong>Exported:</strong> ${new Date(data.exportedAt).toLocaleString()}
    </div>

    <div class="summary">
      <div class="summary-card">
        <h3>Total Features</h3>
        <div class="value">${data.totalFeatures}</div>
      </div>
      <div class="summary-card">
        <h3>Compliant</h3>
        <div class="value" style="color: #28a745;">${data.compliantFeatures}</div>
      </div>
      <div class="summary-card">
        <h3>Non-Compliant</h3>
        <div class="value" style="color: #dc3545;">${data.nonCompliantFeatures}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Support Level</th>
          <th>Baseline Status</th>
          <th>Browsers</th>
        </tr>
      </thead>
      <tbody>
        ${data.features
          .map(
            (feature) => `
        <tr>
          <td>
            <strong>${feature.name}</strong><br>
            <small style="color: #666;">${feature.featureId}</small>
          </td>
          <td>
            <span class="badge badge-${feature.support}">${feature.support}</span>
          </td>
          <td>${feature.baseline ?? "unknown"}</td>
          <td>${feature.browsers.join(", ") || "—"}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="footer">
      Generated by Storybook Baseline Addon
    </div>
  </div>
</body>
</html>
  `.trim();

  return html;
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
