import type { RGB } from "../../../../constants/colour/colourConstants";
import { type ColourMatchBase } from "../../../../constants/colour/colourMatchConstants";
import { convertHEXtoRGB } from "./colourRGBUtils";
import { getRGBBaseKeys } from "./colourMatchStateUtils";
import { subtractiveRGBColourMixingProportions } from "./colourMatchSubtractiveUtil";

// ----------- Pure functions

// using weighted sum
const additiveRGBColourMixingProportions = (
  proportions: Record<`rgbBase${string}`, number>,
  baseObject: ColourMatchBase
): { totalProportions: number; rgb: RGB } => {
  let sumR = 0,
    sumG = 0,
    sumB = 0,
    total = 0;

  // summing weighted proportion
  const rgbBaseKeys = getRGBBaseKeys(baseObject);
  for (const rgbBaseKey of rgbBaseKeys) {
    const proportion = proportions[rgbBaseKey];
    const rgbBase = baseObject[rgbBaseKey];
    if (rgbBase) {
      sumR += rgbBase.rgb.R * proportion;
      sumG += rgbBase.rgb.G * proportion;
      sumB += rgbBase.rgb.B * proportion;
      total += proportion;
    }
  }

  // quick return
  if (total === 0) {
    return { totalProportions: 0, rgb: { R: 0, G: 0, B: 0 } };
  }
  return {
    rgb: {
      R: Math.round(sumR / total),
      G: Math.round(sumG / total),
      B: Math.round(sumB / total),
    },
    totalProportions: total,
  };
};

const rgbMixFromColourProportions = (
  proportions: Record<`rgbBase${string}`, number>,
  baseObject: ColourMatchBase
): { totalProportions: number; rgb: RGB } => {
  switch (baseObject.baseType) {
    case "Additive":
      return additiveRGBColourMixingProportions(proportions, baseObject);
    case "Subtractive":
      return subtractiveRGBColourMixingProportions(proportions, baseObject);
    default:
      throw new Error(`Base Type, ${baseObject.baseType} not identified.`);
  }
};

const checkColourWinCondition = (
  currentHEX: string,
  correctHEX: string
): number => {
  if (currentHEX[0] !== "#" || currentHEX.length !== 7) {
    console.warn("Invalid Current HEX value");
  } else if (correctHEX[0] !== "#" || correctHEX.length !== 7) {
    console.warn("Invalid Correct HEX value");
  }

  const currentRGB = convertHEXtoRGB(currentHEX);
  const correctRGB = convertHEXtoRGB(correctHEX);

  // Euclidean distance to calculate percentage
  const euDist = Math.sqrt(
    (currentRGB.R - correctRGB.R) ** 2 +
      (currentRGB.G - correctRGB.G) ** 2 +
      (currentRGB.B - correctRGB.B) ** 2
  );
  const maxEuDist = Math.sqrt(3) * 255;

  return Math.round((1 - euDist / maxEuDist) * 1000) / 10;
};

export { rgbMixFromColourProportions, checkColourWinCondition };
