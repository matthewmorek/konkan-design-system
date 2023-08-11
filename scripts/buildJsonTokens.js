import {
  permutateThemes,
  registerTransforms,
} from "@tokens-studio/sd-transforms";
import { promises } from "fs";
import path from "path";
import StyleDictionary from "style-dictionary";

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
        transforms: [
          "ts/typography/fontWeight",
          "ts/resolveMath",
          "ts/opacity",
          "ts/color/css/hexrgba",
          "ts/color/modifiers",
          "attribute/color",
          "attribute/cti",
          "name/cti/camel",
        ],
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
