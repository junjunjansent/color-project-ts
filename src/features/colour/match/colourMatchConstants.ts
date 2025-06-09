// import { type RGB } from "../colourConstants";

const ColourMatchBaseCore = {
  base: {
    RGBW: {
      type: "Additive",
      rgbBaseR: { R: 255, G: 0, B: 0 },
      rgbBaseG: { R: 0, G: 255, B: 0 },
      rgbBaseB: { R: 0, G: 0, B: 255 },
      rgbBaseW: { R: 255, G: 255, B: 255 },
    },
    RYBW: {
      type: "Subtractive",
      rgbBaseR: { R: 255, G: 0, B: 0 },
      rgbBaseY: { R: 255, G: 255, B: 0 },
      rgbBaseB: { R: 0, G: 0, B: 255 },
      rgbBaseW: { R: 255, G: 255, B: 255 },
    },
    CMYK: {
      type: "Subtractive",
      rgbBaseC: { R: 0, G: 255, B: 255 },
      rgbBaseM: { R: 255, G: 0, B: 255 },
      rgbBaseY: { R: 255, G: 255, B: 0 },
      rgbBaseK: { R: 255, G: 255, B: 255 },
    },
    null: {},
  },
} as const;

export { ColourMatchBaseCore };
