import { registerTransforms } from "@tokens-studio/sd-transforms";
import { ThemeObject } from "@tokens-studio/types";
import { promises as fsp } from "fs";
import path from "path";
import StyleDictionary, {
  Config,
  DesignToken,
  Named,
  Transform,
} from "style-dictionary";
import { transformFigmaColorToHex8, transformHexToHex8 } from "./functions";

const transforms: string[] = [
  "attribute/color",
  "attribute/cti",
  "ts/opacity",
  "ts/resolveMath",
  "ts/color/modifiers",
  "tceu/color/rgba/hex8",
  "tceu/color/hex/hex8",
];

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

StyleDictionary.registerTransform(hex8Transformer);
StyleDictionary.registerTransform(hexToHex8Transformer);

registerTransforms(StyleDictionary, {
  expand: {
    composition: false,
    typography: false,
    border: false,
    shadow: false,
  },
  excludeParentKeys: false,
  "ts/color/modifiers": {
    format: "srgb",
  },
});

async function run() {
  const $themes: ThemeObject[] = JSON.parse(
    await fsp.readFile(
      path.join(process.cwd(), "./design-tokens/$themes.json"),
      "utf8",
    ),
  );

  const configs: Config[] = $themes.map((theme) => {
    return {
      source: Object.entries(theme.selectedTokenSets)
        .filter(([, val]) => val !== "disabled")
        .map(([tokenset]) => `./design-tokens/${tokenset}.json`),
      platforms: {
        mobile: {
          buildPath: "./dist/",
          transforms: transforms,
          files: [
            {
              filter: (token: DesignToken) =>
                // temporarily filter out anything other than colours
                (token.type === "color" || token.type === "spacing") &&
                // we only want semantic tokens
                token.attributes?.category === "semantic",
              destination: `${theme.name.toLowerCase()}.json`,
              format: "json/nested",
            },
          ],
        },
      },
    } as Config;
  });

  configs.forEach((cfg) => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}

run();
