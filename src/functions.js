export function rgbToHex(value) {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function alphaToHex(value) {
  const hex = Math.round(value * 255).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * Transforms a Figma color value to an 8-digit hexadecimal representation.
 * @param {string} value - The Figma color value to be transformed.
 * @returns {string} - The transformed color value or original color value if the input is `undefined`.
 */
export function transformFigmaColorToHex8(value) {
  if (value === undefined) {
    return value;
  }
  // match Figma Color value i.e: rgba(#ffffff, 0.5)
  const match = /rgba\(\s*#(?<hex>\w+)\s*,\s*?(?<alpha>\d.*?)\)/g.exec(value);
  if (match && match.groups) {
    const { hex, alpha } = match.groups;
    try {
      const hexAlpha = alphaToHex(alpha);
      return `#${hexAlpha}${hex}`;
    } catch (e) {
      console.warn(`Coloru value "${value}" is nto a valid Figma Color value.`);
      return value;
    }
  }
  return value;
}
    return value;
  }
}
