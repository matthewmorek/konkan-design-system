import {
  permutateThemes,
  registerTransforms,
} from "@tokens-studio/sd-transforms";
import { promises } from "fs";
import path from "path";
import StyleDictionary from "style-dictionary";
import {
  transformFigmaColorToHex8,
  transformHexToHex8,
} from "../src/functions.js";

const transforms = [
  "attribute/color",
  "attribute/cti",
  "ts/opacity",
  "ts/resolveMath",
  "ts/color/modifiers",
  "tceu/color/rgba/hex8",
  "tceu/color/hex/hex8",
];

// register custom transformers
StyleDictionary.registerTransform({
  name: "tceu/color/rgba/hex8",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "color",
  transformer: (token) => transformFigmaColorToHex8(token.value),
});

StyleDictionary.registerTransform({
  name: "tceu/color/hex/hex8",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "color",
  transformer: (token) => transformHexToHex8(token.value),
});

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
  const $themes = JSON.parse(
    await promises.readFile(
      path.join(process.cwd(), "./design-tokens/$themes.json"),
      "utf8"
    )
  );
  const themes = permutateThemes($themes, { seperator: "-" });

  const configs = Object.entries(themes).map(([name, tokenSets]) => ({
    source: tokenSets.map((tokenSet) => `./design-tokens/${tokenSet}.json`),
    platforms: {
      mobile: {
        buildPath: "./dist/",
        prefix: "mobile",
        transforms: transforms,
        files: [
          {
            filter: (token) =>
              // temporarily filter out anything other than colours
              token.type === "color" &&
              // we only want semantic tokens
              token.attributes.category === "semantic",
            destination: `tokens-${name.toLowerCase()}.json`,
            format: "json/nested",
          },
        ],
      },
    },
  }));

  configs.forEach((cfg) => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}

run();
