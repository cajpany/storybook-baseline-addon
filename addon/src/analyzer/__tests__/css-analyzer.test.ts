import { describe, it, expect } from "vitest";

import { parseCss, toFeatureUsages } from "../css-analyzer";

function analyze(css: string) {
  const parsed = parseCss(css, { sourcePath: "Inline.css" });
  return toFeatureUsages(parsed);
}

describe("css-analyzer feature mapping", () => {
  it("detects container queries and grid layout", () => {
    const css = `
      @container card (min-width: 30rem) {
        .card {
          display: grid;
        }
      }
    `;

    const usages = analyze(css);
    const featureIds = usages.map((usage) => usage.featureId);

    expect(featureIds).toEqual(
      expect.arrayContaining(["container-queries", "grid"]),
    );
  });

  it("detects :has pseudo-class and flexbox", () => {
    const css = `
      .list:has(> li.selected) {
        display: flex;
      }
    `;

    const usages = analyze(css);
    const featureIds = usages.map((usage) => usage.featureId);

    expect(featureIds).toEqual(expect.arrayContaining(["has", "flexbox"]));
  });

  it("ignores unrelated declarations", () => {
    const css = `
      .button {
        color: red;
        padding: 1rem;
      }
    `;

    const usages = analyze(css);

    expect(usages).toHaveLength(0);
  });
});
