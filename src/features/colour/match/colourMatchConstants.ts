// import { type RGB } from "../colourConstants";

// ---------- Colour Base

// I included baseName for easier UI rendering
const colourMatchBases = {
  RGBW: {
    baseName: "RGBW",
    baseType: "Additive",
    rgbBaseR: { R: 255, G: 0, B: 0 },
    rgbBaseG: { R: 0, G: 255, B: 0 },
    rgbBaseB: { R: 0, G: 0, B: 255 },
    rgbBaseW: { R: 255, G: 255, B: 255 },
  },
  RYBW: {
    baseName: "RYBW",
    baseType: "Subtractive",
    rgbBaseR: { R: 255, G: 0, B: 0 },
    rgbBaseY: { R: 255, G: 255, B: 0 },
    rgbBaseB: { R: 0, G: 0, B: 255 },
    rgbBaseW: { R: 255, G: 255, B: 255 },
  },
  CMYK: {
    baseName: "CMYK",
    baseType: "Subtractive",
    rgbBaseC: { R: 0, G: 255, B: 255 },
    rgbBaseM: { R: 255, G: 0, B: 255 },
    rgbBaseY: { R: 255, G: 255, B: 0 },
    rgbBaseK: { R: 255, G: 255, B: 255 },
  },
} as const;

type ColourMatchBasesFull = typeof colourMatchBases;
type ColourMatchBaseNames = keyof ColourMatchBasesFull;

// specific function for type checking via type predicate
const isColourMatchBase = (value: string): value is ColourMatchBaseNames => {
  return value in colourMatchBases; // use in operator to check Boolean
};

// ---------- Colour Play Style

type ColourGamePlayStyle = "random" | "levelled";

// ---------- Colour Level

const colourLevelDetails = {
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
  type ColourMatchBasesFull,
  type ColourMatchBaseNames,
  type ColourGamePlayStyle,
  isColourMatchBase,
};
