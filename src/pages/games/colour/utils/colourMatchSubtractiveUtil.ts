import type { RGB } from "../../../../constants/colour/colourConstants";
import { type ColourMatchBase } from "../../../../constants/colour/colourMatchConstants";
import { getRGBBaseKeys } from "./colourMatchStateUtils";

// had to rely on ChatGPT to breakdown subtractive mix color-mixing (trying to emulate CSS function color-mix)

const RGBtoHSL = ({ R, G, B }: RGB) => {
  R /= 255;
  G /= 255;
  B /= 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  let H = 0,
    S = 0,
    L = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case R:
        H = (G - B) / d + (G < B ? 6 : 0);
        break;
      case G:
        H = (B - R) / d + 2;
        break;
      case B:
        H = (R - G) / d + 4;
        break;
    }
    H *= 60;
  }

  return { H, S, L };
};

// Convert HSL to RGB (h in degrees, s,l in 0–1; output R,G,B in 0–255)
const HSLToRGB = (H: number, S: number, L: number): RGB => {
  H /= 360;

  function hueToRGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  let R: number, G: number, B: number;
  if (S === 0) {
    R = G = B = L;
  } else {
    const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    const p = 2 * L - q;
    R = hueToRGB(p, q, H + 1 / 3);
    G = hueToRGB(p, q, H);
    B = hueToRGB(p, q, H - 1 / 3);
  }

  return {
    R: Math.round(R * 255),
    G: Math.round(G * 255),
    B: Math.round(B * 255),
  };
};

// Interpolate hue (in degrees) along the shortest path
const interpolateHue = (h1: number, h2: number, t: number): number => {
  let delta = h2 - h1;
  if (delta > 180) delta -= 360;
  else if (delta < -180) delta += 360;
  return (h1 + delta * t + 360) % 360;
};

// Mix two RGB colors based on their proportions
const mixTwoColors = (
  color1: RGB,
  color2: RGB,
  p1: number,
  p2: number
): { color: RGB; proportion: number } => {
  const total = p1 + p2;
  if (total === 0) {
    return { color: { R: 0, G: 0, B: 0 }, proportion: 0 };
  }

  const hsl1 = RGBtoHSL(color1);
  const hsl2 = RGBtoHSL(color2);
  const t = p2 / total;

  const H = interpolateHue(hsl1.H, hsl2.H, t);
  const S = (hsl1.S * p1 + hsl2.S * p2) / total;
  const L = (hsl1.L * p1 + hsl2.L * p2) / total;

  return { color: HSLToRGB(H, S, L), proportion: total };
};

// Main mixing function for multiple color proportions, it mixes two colours linearly and iterates this over the four avail colours
const subtractiveRGBColourMixingProportions = (
  proportions: Record<`rgbBase${string}`, number>,
  baseObject: ColourMatchBase
): { totalProportions: number; rgb: RGB } => {
  const keys = getRGBBaseKeys(baseObject).filter((key) => proportions[key] > 0);

  if (keys.length === 0) {
    return { totalProportions: 0, rgb: { R: 0, G: 0, B: 0 } };
  }

  let currentColor = baseObject[keys[0]].rgb;
  let currentProportion = proportions[keys[0]];

  for (let i = 1; i < keys.length; i++) {
    const key = keys[i];
    const nextColor = baseObject[key].rgb;
    const nextProportion = proportions[key];

    if (nextProportion <= 0) continue; // Skip zero proportions

    const result = mixTwoColors(
      currentColor,
      nextColor,
      currentProportion,
      nextProportion
    );
    currentColor = result.color;
    currentProportion = result.proportion;
  }

  return { totalProportions: currentProportion, rgb: currentColor };
};

// function rgbToHsl({ R, G, B }: RGB) {
//   const r = R / 255,
//     g = G / 255,
//     b = B / 255;
//   const max = Math.max(r, g, b);
//   const min = Math.min(r, g, b);
//   let h = 0,
//     s = 0,
//     l = (max + min) / 2;

//   if (max !== min) {
//     const d = max - min;
//     s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

//     switch (max) {
//       case r:
//         h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
//         break;
//       case g:
//         h = ((b - r) / d + 2) * 60;
//         break;
//       case b:
//         h = ((r - g) / d + 4) * 60;
//         break;
//     }
//   }

//   return { h, s, l };
// }

// function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): RGB {
//   const c = (1 - Math.abs(2 * l - 1)) * s;
//   const hp = h / 60;
//   const x = c * (1 - Math.abs((hp % 2) - 1));
//   let r = 0,
//     g = 0,
//     b = 0;

//   if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
//   else if (hp >= 1 && hp < 2) [r, g, b] = [x, c, 0];
//   else if (hp >= 2 && hp < 3) [r, g, b] = [0, c, x];
//   else if (hp >= 3 && hp < 4) [r, g, b] = [0, x, c];
//   else if (hp >= 4 && hp < 5) [r, g, b] = [x, 0, c];
//   else if (hp >= 5 && hp < 6) [r, g, b] = [c, 0, x];

//   const m = l - c / 2;
//   return {
//     R: Math.round((r + m) * 255),
//     G: Math.round((g + m) * 255),
//     B: Math.round((b + m) * 255),
//   };
// }

// function subtractiveRGBColourMixingProportions(
//   proportions: Record<`rgbBase${string}`, number>,
//   baseObject: ColourMatchBase
// ): { totalProportions: number; rgb: RGB } {
//   const keys = getRGBBaseKeys(baseObject);
//   const total = keys.reduce((sum, k) => sum + proportions[k], 0);

//   if (total === 0) {
//     // No pigments => white by default
//     return { totalProportions: 0, rgb: { R: 255, G: 255, B: 255 } };
//   }

//   // Initialize accumulators for hue as vector sum, saturation, and lightness weighted sums
//   let x = 0,
//     y = 0,
//     sSum = 0,
//     lSum = 0;

//   for (const key of keys) {
//     const weight = proportions[key];
//     const { rgb } = baseObject[key];
//     const { h, s, l } = rgbToHsl(rgb);

//     const rad = (h * Math.PI) / 180;
//     x += Math.cos(rad) * weight;
//     y += Math.sin(rad) * weight;
//     sSum += s * weight;
//     lSum += l * weight;
//   }

//   // Calculate weighted average hue from vector sum
//   let mixedHue = (Math.atan2(y, x) * 180) / Math.PI;
//   if (mixedHue < 0) mixedHue += 360;

//   const mixedS = sSum / total;
//   const mixedL = lSum / total;

//   const rgb = hslToRgb({ h: mixedHue, s: mixedS, l: mixedL });

//   return { totalProportions: total, rgb };
// }

export { subtractiveRGBColourMixingProportions };
