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
  value: string | undefined
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
  return value;
}

/**
 * Transforms a 6-digit hexadecimal color value to an 8-digit hexadecimal representation.
 * @param value - The 6-digit hexadecimal color value to be transformed.
 * @returns - The transformed color value or original value if the input is `undefined`.
 */
export function transformHexToHex8(
  value: string | undefined
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
  return value;
}
