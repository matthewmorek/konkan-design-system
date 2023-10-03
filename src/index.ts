import {
  permutateThemes,
  registerTransforms,
} from "@tokens-studio/sd-transforms";
import { ThemeObject, TokenSetStatus } from "@tokens-studio/types";
import { promises as fsp } from "fs";
import path from "path";
import StyleDictionary, {
  Config,
  DesignToken,
  Named,
  Transform,
} from "style-dictionary";
import {
  cleanDirectory,
  evaluateMathExpression,
  transformFigmaColorToHex8,
  transformHexToHex8,
} from "./functions";

// register custom transformers
const hex8Transformer: Named<Transform> = {
  name: "tceu/color/rgba/hex8",
  type: "value",
  transitive: true,
  matcher: (token: DesignToken) => token.type === "color",
  transformer: (token: DesignToken) => transformFigmaColorToHex8(token.value),
};

const hexToHex8Transformer: Named<Transform> = {
  name: "tceu/color/hex/hex8",
  type: "value",
  transitive: true,
  matcher: (token: DesignToken) => token.type === "color",
  transformer: (token: DesignToken) => transformHexToHex8(token.value),
};

const allowedTypographyTypes: string[] = [
  "lineHeights",
  "letterSpacing",
  "textDecoration",
  "fontSizes",
  "fontFamilies",
  "fontWeights",
  "typography",
];

const mathTransformer: Named<Transform> = {
  name: "tceu/resolveMath",
  type: "value",
  transitive: true,
  matcher: (token: DesignToken) => allowedTypographyTypes.includes(token.type),
  transformer: (token: DesignToken) => {
    let tokenValue = token.value;
    if (token.type === "typography") {
      for (const prop in tokenValue) {
        if (typeof tokenValue[prop] === "string") {
          tokenValue[prop] = evaluateMathExpression(tokenValue[prop]);
        }
      }
      return tokenValue;
    }
    return evaluateMathExpression(tokenValue);
  },
};

StyleDictionary.registerTransform(hex8Transformer);
StyleDictionary.registerTransform(hexToHex8Transformer);
StyleDictionary.registerTransform(mathTransformer);

registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: true,
    border: false,
    shadow: false,
  },
  excludeParentKeys: false,
  "ts/color/modifiers": {
    format: "srgb",
  },
});

// declare transforms to be used
const transforms: string[] = [
  "attribute/color",
  "attribute/cti",
  "ts/opacity",
  "ts/resolveMath",
  "ts/color/modifiers",
  "tceu/color/rgba/hex8",
  "tceu/color/hex/hex8",
  "tceu/resolveMath",
];

// allowed types of design tokens to be output
const allowedTypes: string[] = [
  "color",
  "spacing",
  "borderRadius",
  "borderWidth",
  ...allowedTypographyTypes,
];

async function run() {
  const $themes: ThemeObject[] = JSON.parse(
    await fsp.readFile(
      path.join(process.cwd(), "./design-tokens/$themes.json"),
      "utf8",
    ),
  );

  const themes: any[] = permutateThemes($themes);

  const configs: Config[] = Object.entries(themes).map(([name, tokenSets]) => {
    return {
      source: tokenSets.map(
        (tokenSet: Record<string, TokenSetStatus>) =>
          `./design-tokens/${tokenSet}.json`,
      ),
      platforms: {
        mobile: {
          buildPath: "./dist/",
          transforms: transforms,
          files: [
            {
              filter: (token: DesignToken) =>
                // temporarily filter out anything other than colours
                allowedTypes.includes(token.type) &&
                // we only want semantic tokens
                token.attributes?.category === "semantic",
              destination: `${name.toLowerCase()}.json`,
              format: "json/nested",
            },
          ],
        },
      },
    } as Config;
  });

  cleanDirectory(path.join(process.cwd(), "./dist"));

  configs.forEach((cfg) => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}

run();
