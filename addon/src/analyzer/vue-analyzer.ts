import { parse as compileVueSFC } from "@vue/compiler-sfc";

export interface VueAnalyzerOptions {
  sourcePath: string;
  filename?: string;
}

export interface ExtractedVueCSS {
  css: string;
  source: "vue-sfc" | "vue-styled-components" | "pinceau" | "unknown";
  scoped: boolean;
  module: boolean;
  lang: string;
  location?: {
    line: number;
    column: number;
  };
}

export interface VueAnalyzerResult {
  source: string;
  extractedStyles: ExtractedVueCSS[];
  errors: string[];
}

/**
 * Parse Vue Single File Component and extract CSS
 */
export function parseVueSFC(
  code: string,
  options: VueAnalyzerOptions
): VueAnalyzerResult {
  const result: VueAnalyzerResult = {
    source: options.sourcePath,
    extractedStyles: [],
    errors: [],
  };

  try {
    const { descriptor, errors } = compileVueSFC(code, {
      filename: options.filename || options.sourcePath,
    });

    // Log parse errors
    if (errors.length > 0) {
      // Only log the first few errors to avoid console spam
      const errorsToLog = errors.slice(0, 3);
      errorsToLog.forEach((error: any) => {
        const errorMsg = error?.message || error?.msg || String(error);
        if (errorMsg && errorMsg !== 'undefined') {
          result.errors.push(`Parse error: ${errorMsg}`);
        }
      });
      if (errors.length > 3) {
        result.errors.push(`... and ${errors.length - 3} more parse errors`);
      }
    }

    // Extract from <style> blocks
    if (descriptor.styles && descriptor.styles.length > 0) {
      descriptor.styles.forEach((style, index) => {
        // Skip preprocessors for MVP
        if (style.lang && style.lang !== "css" && style.lang !== "postcss") {
          result.errors.push(
            `Skipping <style lang="${style.lang}"> - preprocessors not supported yet. Use compiled CSS or manual annotation.`
          );
          return;
        }

        const cssContent = style.content.trim();
        if (cssContent) {
          result.extractedStyles.push({
            css: cssContent,
            source: "vue-sfc",
            scoped: style.scoped || false,
            module: style.module !== false && style.module !== null,
            lang: style.lang || "css",
            location: style.loc
              ? {
                  line: style.loc.start.line,
                  column: style.loc.start.column,
                }
              : undefined,
          });
        }
      });
    }

    // Extract from <script> for CSS-in-JS
    if (descriptor.script || descriptor.scriptSetup) {
      const scriptContent =
        descriptor.script?.content || descriptor.scriptSetup?.content || "";

      if (scriptContent) {
        // Check for vue-styled-components or Pinceau
        const hasVueStyled = scriptContent.includes("vue-styled-components");
        const hasPinceau = scriptContent.includes("pinceau");

        if (hasVueStyled || hasPinceau) {
          result.errors.push(
            `Detected Vue CSS-in-JS library. Use 'jsSource' parameter with 'autoDetectJS' for CSS-in-JS extraction.`
          );
        }
      }
    }
  } catch (error) {
    result.errors.push(
      `Failed to parse Vue SFC ${options.sourcePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return result;
}

/**
 * Combine multiple extracted CSS strings into one
 */
export function combineVueCSS(extracted: ExtractedVueCSS[]): string {
  return extracted.map((item) => item.css).join("\n\n");
}

/**
 * Get a descriptive name for the source type
 */
export function getSourceTypeName(source: ExtractedVueCSS["source"]): string {
  switch (source) {
    case "vue-sfc":
      return "Vue SFC";
    case "vue-styled-components":
      return "vue-styled-components";
    case "pinceau":
      return "Pinceau";
    default:
      return "unknown";
  }
}
