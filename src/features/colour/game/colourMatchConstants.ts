import { type RGB } from "../colourConstants";

// ---------- Colour Base

interface ColourMatchBase {
  baseName: string;
  baseType: "Additive" | "Subtractive";
  [key: `rgbBase${string}`]: { label: string; rgb: RGB };
}

// I included baseName for easier UI rendering
const colourMatchBases: Record<string, ColourMatchBase> = {
  RGBW: {
    baseName: "RGBW",
    baseType: "Additive",
    rgbBaseR: { label: "Red", rgb: { R: 255, G: 0, B: 0 } },
    rgbBaseG: { label: "Green", rgb: { R: 0, G: 255, B: 0 } },
    rgbBaseB: { label: "Blue", rgb: { R: 0, G: 0, B: 255 } },
    rgbBaseW: { label: "White", rgb: { R: 255, G: 255, B: 255 } },
  },
  RYBW: {
    baseName: "RYBW",
    baseType: "Subtractive",
    rgbBaseR: { label: "Red", rgb: { R: 255, G: 0, B: 0 } },
    rgbBaseY: { label: "Yellow", rgb: { R: 255, G: 255, B: 0 } },
    rgbBaseB: { label: "Blue", rgb: { R: 0, G: 0, B: 255 } },
    rgbBaseW: { label: "White", rgb: { R: 255, G: 255, B: 255 } },
  },
  // RYBW2: {
  //   baseName: "RYBW2",
  //   baseType: "Subtractive",
  //   rgbBaseR: { label: "Cardinal Red", rgb: { R: 196, G: 30, B: 58 } },
  //   rgbBaseY: { label: "School Bus Yellow", rgb: { R: 255, G: 216, B: 0 } },
  //   rgbBaseB: { label: "Dark Blue", rgb: { R: 0, G: 0, B: 200 } },
  //   rgbBaseW: { label: "White", rgb: { R: 255, G: 255, B: 255 } },
  // },
  // CMYK: {
  //   baseName: "CMYK",
  //   baseType: "Subtractive",
  //   rgbBaseC: { label: "Cyan / Aqua", rgb: { R: 0, G: 255, B: 255 } },
  //   rgbBaseM: { label: "Magenta / Fuchsia", rgb: { R: 255, G: 0, B: 255 } },
  //   rgbBaseY: { label: "Yellow", rgb: { R: 255, G: 255, B: 0 } },
  //   rgbBaseK: { label: "Black", rgb: { R: 0, G: 0, B: 0 } },
  // },
} as const;

// ---------- Colour Play Style

type ColourGamePlayStyle = "random" | "levelled";

type ColourLevelDetail = {
  level: number | string;
  coloursAvail: number;
  maxRounds: number;
  maxClicksPerColour: number;
};

// ---------- Colour Level

const colourLevelDetails: {
  [key: string]: ColourLevelDetail;
} = {
  level1: {
    level: 1,
    coloursAvail: 2,
    maxRounds: 2,
    maxClicksPerColour: 3,
  },
  level2: {
    level: 2,
    coloursAvail: 3,
    maxRounds: 2,
    maxClicksPerColour: 3,
  },
  level3: {
    level: 3,
    coloursAvail: 3,
    maxRounds: 3,
    maxClicksPerColour: 4,
  },
  level4: {
    level: 4,
    coloursAvail: 4,
    maxRounds: 3,
    maxClicksPerColour: 3,
  },
  level5: {
    level: 5,
    coloursAvail: 4,
    maxRounds: 3,
    maxClicksPerColour: 4,
  },
  level6: {
    level: 6,
    coloursAvail: 4,
    maxRounds: 5,
    maxClicksPerColour: 5,
  },
  random: {
    level: "random",
    coloursAvail: 4,
    maxRounds: 3,
    maxClicksPerColour: 5,
  },
} as const;

export {
  colourMatchBases,
  colourLevelDetails,
  type ColourMatchBase,
  type ColourGamePlayStyle,
  type ColourLevelDetail,
};
