import type { RGB } from "../colourConstants";
import { convertHEXtoRGB } from "../colourRGBUtils";
import { type ColourMatchBase } from "./colourMatchConstants";
import { getRGBBaseKeys } from "./colourMatchStateUtils";

// ----------- Pure functions

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

// Convert sRGB (0–255) to linear RGB (0–1) for accurate color math
function srgbToLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

// Step 1: Convert RGB color to approximate reflectance values
function rgbToReflectance(rgb: RGB) {
  return {
    r: srgbToLinear(rgb.R),
    g: srgbToLinear(rgb.G),
    b: srgbToLinear(rgb.B),
  };
}

// Step 2: Convert reflectance to Kubelka–Munk K/S ratio
function reflectanceToKS(R: number) {
  // Clamp reflectance to avoid division errors at extremes
  const clamped = Math.min(Math.max(R, 0.05), 0.95);
  return (1 - clamped) ** 2 / (2 * clamped);
}

// Example scattering coefficients for each pigment channel
const pigmentScatter: Record<`rgbBase${string}`, RGB> = {
  rgbBaseR: { R: 1.2, G: 1.0, B: 0.8 },
  rgbBaseY: { R: 1.3, G: 3.0, B: 1.0 }, // Yellow scatters more green light
  rgbBaseB: { R: 0.9, G: 1.2, B: 1.4 },
  rgbBaseW: { R: 1.5, G: 1.5, B: 1.5 },
  rgbBaseC: { R: 0.9, G: 1.3, B: 1.5 }, // Cyan scatters mostly blue & green light
  rgbBaseM: { R: 1.4, G: 0.8, B: 1.3 }, // Magenta scatters mostly red & blue
  rgbBaseK: { R: 1.5, G: 1.5, B: 1.5 },
};

// Step 3: Get K and S values from pigment RGB and scatter coefficients
function ksFromRGB(rgb: RGB, pigmentKey: `rgbBase${string}`) {
  const refl = rgbToReflectance(rgb);
  const S = pigmentScatter[pigmentKey];

  return {
    K: {
      R: reflectanceToKS(refl.r),
      G: reflectanceToKS(refl.g),
      B: reflectanceToKS(refl.b),
    },
    S,
  };
}

// Step 4: Main subtractive mixing function
function subtractiveRGBColourMixingProportions(
  proportions: Record<`rgbBase${string}`, number>,
  baseObject: ColourMatchBase
): { totalProportions: number; rgb: RGB } {
  let total = 0;

  // Sum weighted K and S values
  const sumK = { R: 0, G: 0, B: 0 };
  const sumS = { R: 0, G: 0, B: 0 };

  // Loop through each pigment in proportions
  const rgbBaseKeys = getRGBBaseKeys(baseObject);
  for (const key of rgbBaseKeys) {
    const p = proportions[key];
    if (!p || p <= 0) continue;

    const pigmentRGB = baseObject[key].rgb;
    const { K, S } = ksFromRGB(pigmentRGB, key);

    total += p;
    sumK.R += K.R * p;
    sumK.G += K.G * p;
    sumK.B += K.B * p;

    sumS.R += S.R * p;
    sumS.G += S.G * p;
    sumS.B += S.B * p;
  }

  // If no pigments, return white (no color)
  if (total === 0) {
    return { totalProportions: 0, rgb: { R: 255, G: 255, B: 255 } };
  }

  // Calculate average K and S by total proportions
  const avgK = {
    R: sumK.R / total,
    G: sumK.G / total,
    B: sumK.B / total,
  };

  const avgS = {
    R: sumS.R / total,
    G: sumS.G / total,
    B: sumS.B / total,
  };

  // Step 5: Convert average K and S back to reflectance
  function ksToReflectance(K: number, S: number) {
    const ratio = K / S;
    return 1 + ratio - Math.sqrt(ratio * ratio + 2 * ratio);
  }

  const reflectance = {
    r: ksToReflectance(avgK.R, avgS.R),
    g: ksToReflectance(avgK.G, avgS.G),
    b: ksToReflectance(avgK.B, avgS.B),
  };

  // Step 6: Convert reflectance (linear RGB) back to sRGB (0–255)
  function linearToSrgb(c: number) {
    if (c <= 0.0031308) return Math.round(c * 12.92 * 255);
    return Math.round((1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255);
  }

  return {
    totalProportions: total,
    rgb: {
      R: linearToSrgb(reflectance.r),
      G: linearToSrgb(reflectance.g),
      B: linearToSrgb(reflectance.b),
    },
  };
}

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
