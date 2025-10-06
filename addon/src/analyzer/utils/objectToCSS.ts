/**
 * Utilities for converting JavaScript object styles to CSS strings
 */

/**
 * Convert camelCase to kebab-case
 * Handles vendor prefixes: WebkitTransform -> -webkit-transform
 */
export function camelToKebab(str: string): string {
  // Handle vendor prefixes (WebkitTransform -> -webkit-transform, msFlexDirection -> -ms-flex-direction)
  if (/^[A-Z]/.test(str) || /^ms[A-Z]/.test(str)) {
    str = `-${str}`;
  }

  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Properties that should not have units added to numeric values
 */
const UNITLESS_PROPERTIES = new Set([
  "opacity",
  "z-index",
  "font-weight",
  "line-height",
  "flex",
  "flex-grow",
  "flex-shrink",
  "order",
  "zoom",
  "animation-iteration-count",
  "column-count",
  "fill-opacity",
  "flood-opacity",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
]);

/**
 * Add appropriate units to numeric values
 */
export function addUnits(property: string, value: number): string {
  if (UNITLESS_PROPERTIES.has(property)) {
    return String(value);
  }
  return `${value}px`;
}

/**
 * Convert a JavaScript value to a CSS value string
 */
export function valueToCss(value: unknown, property: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  // String values
  if (typeof value === "string") {
    return value;
  }

  // Numeric values
  if (typeof value === "number") {
    return addUnits(property, value);
  }

  // Boolean values
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  // Array values (multiple values)
  if (Array.isArray(value)) {
    return value
      .map((v) => valueToCss(v, property))
      .filter((v): v is string => v !== null)
      .join(" ");
  }

  // Skip complex objects, functions, etc.
  return null;
}

/**
 * Convert a JavaScript object to CSS declarations
 * Handles nested selectors and pseudo-classes
 */
export function objectToCSS(
  obj: Record<string, unknown>,
  indent: string = ""
): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    // Handle nested selectors (e.g., '&:hover', '& > div')
    if (key.startsWith("&") || key.startsWith(":") || key.startsWith("@")) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        lines.push(`${indent}${key} {`);
        lines.push(objectToCSS(value as Record<string, unknown>, indent + "  "));
        lines.push(`${indent}}`);
      }
      continue;
    }

    // Handle regular CSS properties
    const cssProperty = camelToKebab(key);
    const cssValue = valueToCss(value, cssProperty);

    if (cssValue !== null) {
      lines.push(`${indent}${cssProperty}: ${cssValue};`);
    }
  }

  return lines.join("\n");
}

/**
 * Convert a flat object to CSS (no nesting)
 */
export function flatObjectToCSS(obj: Record<string, unknown>): string {
  const declarations: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const cssProperty = camelToKebab(key);
    const cssValue = valueToCss(value, cssProperty);

    if (cssValue !== null) {
      declarations.push(`${cssProperty}: ${cssValue};`);
    }
  }

  return declarations.join("\n");
}
