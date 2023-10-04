import { readdirSync, unlinkSync } from "fs";
import path from "path";
import * as math from "mathjs";

export function rgbToHex(value: number): string {
  const hex: string = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function alphaToHex(value: number): string {
  const hex: string = Math.round(value * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * Transforms a Figma color value to an 8-digit hexadecimal representation.
 * @param value - The Figma color value to be transformed.
 * @returns - The transformed color value or original color value if the input is `undefined`.
 */
export function transformFigmaColorToHex8(
  value: string | undefined,
): string | undefined {
  if (value === undefined) {
    return value;
  }
  const match: RegExpExecArray | null =
    /rgba\(\s*#(?<hex>\w+)\s*,\s*?(?<alpha>\d.*?)\)/g.exec(value);
  if (match && match.groups) {
    const { hex, alpha } = match.groups;
    try {
      const hexAlpha: string = alphaToHex(parseFloat(alpha));
      return `#${hexAlpha}${hex}`;
    } catch (e: any) {
      console.warn(`Color value "${value}" is not a valid Figma color value.`);
      return value;
    }
  }
  return value.toUpperCase();
}

/**
 * Transforms a 6-digit hexadecimal color value to an 8-digit hexadecimal representation.
 * @param value - The 6-digit hexadecimal color value to be transformed.
 * @returns - The transformed color value or original value if the input is `undefined`.
 */
export function transformHexToHex8(
  value: string | undefined,
): string | undefined {
  if (value === undefined) {
    return value;
  }
  const match: RegExpExecArray | null = /#(?<hex>[0-9A-Fa-f]{6})/g.exec(value);
  if (match && match.groups) {
    const { hex } = match.groups;
    try {
      return `#FF${hex}`;
    } catch (e: any) {
      console.warn(`Color value "${value}" is not a valid color value.`);
      return value;
    }
  }
  return value.toUpperCase();
}

/**
 * Removes all JSON files in a given directory.
 * @param {string} directory - The path to the directory to clean.
 * @returns {void}
 */
export function cleanDirectory(directory: string): void {
  const fileNames = readdirSync(directory);
  fileNames.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    if (fileName.endsWith(".json")) {
      unlinkSync(filePath);
    }
  });
}

/**
 * Evaluates a mathematical expression and returns the result.
 * @param {string|number|boolean|undefined} expression - The expression to evaluate.
 * @returns {string|number|boolean|undefined} - The evaluated result, or the original expression if it is invalid or an error occurred during evaluation.
 */
export function evaluateMathExpression(
  expression: string | number | boolean | undefined,
): string | number | boolean | undefined {
  if (expression === undefined || typeof expression === "boolean") {
    return expression;
  }

  const expressionString = expression.toString();

  // Regular expression for accepted math expression characters, including mathematical functions
  const mathExpressionRegex = /^[-+\/*\s\d.()a-z,\[\]]+$/i;

  // Check if the expression contains any invalid characters
  if (!mathExpressionRegex.test(expressionString)) {
    return expression;
  }

  try {
    const parsedExpression = math.compile(expressionString);
    const result = parsedExpression.evaluate();
    return result;
  } catch (error) {
    return expression;
  }
}
