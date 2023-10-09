import { describe, it, expect } from "@jest/globals";
import {
  rgbToHex,
  alphaToHex,
  transformFigmaColorToHex8,
  transformHexToHex8,
  evaluateMathExpression,
} from "../src/functions";

describe("rgbToHex", () => {
  it("should convert a number to a hexadecimal string", () => {
    expect(rgbToHex(255)).toBe("ff");
  });

  it("should convert a number less than 16 to a two-digit hexadecimal string", () => {
    expect(rgbToHex(8)).toBe("08");
  });
});

describe("alphaToHex", () => {
  it("should convert a number to a hexadecimal string", () => {
    expect(alphaToHex(0.5)).toBe("80");
  });

  it("should convert a number less than 16 to a two-digit hexadecimal string", () => {
    expect(alphaToHex(0.2)).toBe("33");
  });
});

describe("transformFigmaColorToHex8", () => {
  it("should transform a valid Figma color value to an 8-digit hexadecimal representation", () => {
    expect(transformFigmaColorToHex8("rgba(#FFFFFF,0.5)")).toBe("#80FFFFFF");
  });

  it("should return undefined for an input that is undefined", () => {
    expect(transformFigmaColorToHex8(undefined)).toBeUndefined();
  });

  it("should return the input value if it is not a valid Figma color value", () => {
    expect(transformFigmaColorToHex8("rgba(#FF0000)")).toBe("RGBA(#FF0000)");
  });
});

describe("transformHexToHex8", () => {
  it("should transform a valid 6-digit hexadecimal color value to an 8-digit hexadecimal representation", () => {
    expect(transformHexToHex8("#FFFFFF")).toBe("#FFFFFFFF");
  });

  it("should return undefined for an input that is undefined", () => {
    expect(transformHexToHex8(undefined)).toBeUndefined();
  });

  it("should return the input value if it is not a valid 6-digit hexadecimal color value", () => {
    expect(transformHexToHex8("#FF000")).toBe("#FF000");
  });
});

// ingore this for now as incomplete ESM implementation in Jest is causing issues when mocking fs from Node
describe.skip("cleanDirectory", () => {
  it("should remove all JSON files in the directory", () => {
    // const MOCK_FILE_INFO = {
    //   "/path/to/file1.json": JSON.stringify('{ "token": "value" }'),
    //   "/path/to/file2.jon": JSON.stringify('{ "token2": "value2" }'),
    // };
    // const expected = ["file1.json", "file2.json"];
    // it("should remove all JSON files in the given directory", () => {
    //   const dirContentsBefore = readdirSync("/path/to");
    //   expect(dirContentsBefore).toBe(expected);
    //   cleanDirectory("/path/to");
    //   const dirContentsAfter = readdirSync("/path/to");
    //   expect(dirContentsAfter).toBe([]);
    // });
  });
});

describe("evaluateMathExpression", () => {
  it("should evaluate a valid mathematical expression and return the result", () => {
    expect(evaluateMathExpression("2 + 3 + 0")).toBe(5);
  });

  it("should return the input value if it is undefined or a boolean", () => {
    expect(evaluateMathExpression(undefined)).toBeUndefined();
    expect(evaluateMathExpression(true)).toBe(true);
  });

  it("should return the input value if it contains invalid characters", () => {
    expect(evaluateMathExpression("2 + @")).toBe("2 + @");
  });
});
