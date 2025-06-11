import type { RGB } from "../colourConstants";
import {
  type ColourMatchBase,
  type ColourGamePlayStyle,
  colourMatchBases,
  colourLevelDetails,
} from "./colourMatchConstants";

// ----------- Pure functions

const getRGBBaseKeys = (baseObject: ColourMatchBase): `rgbBase${string}`[] => {
  // type predicate via is to ensure any key selected has type required
  return Object.keys(baseObject).filter((key): key is `rgbBase${string}` =>
    /^rgbBase[A-Z]/.test(key)
  );
};

const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));

const additiveRGBColourMixingProportions = (
  proportions: Record<`rgbBase${string}`, number>,
  baseObject: ColourMatchBase
): RGB => {
  let R = 0,
    G = 0,
    B = 0;
  let total = 0;

  const rgbBaseKeys = getRGBBaseKeys(baseObject);

  for (const rgbBaseKey of rgbBaseKeys) {
    const proportion = proportions[rgbBaseKey];
    const rgbBase = baseObject[rgbBaseKey];
    if (rgbBase) {
      R += rgbBase.rgb.R * proportion;
      G += rgbBase.rgb.G * proportion;
      B += rgbBase.rgb.B * proportion;
      total += proportion;
    }
  }
  if (total === 0) return { R: 0, G: 0, B: 0 };
  return {
    R: clamp(R),
    G: clamp(G),
    B: clamp(B),
  };
};

const rgbMixFromColourProportions = (
  proportions: Record<`rgbBase${string}`, number>,
  baseObject: ColourMatchBase
): RGB => {
  switch (baseObject.baseType) {
    case "Additive":
      return additiveRGBColourMixingProportions(proportions, baseObject);
    case "Subtractive":
      return { R: 0, G: 0, B: 0 };
    default:
      throw new Error(`Base Type, ${baseObject.baseType} not identified.`);
  }
};

// ----------- Impure functions - Read Values from colourMatchBases & colourLevelDetails

const getColourMatchBase = (baseName: string): ColourMatchBase => {
  // extract base Object via colourMatchBases
  if (!(baseName in colourMatchBases)) {
    throw new Error(`Unable to find base, ${baseName} in getColourMatchBase`);
  }
  const baseObject = colourMatchBases[baseName];
  return baseObject;
};

const randomiseColourProportions = (
  playStyle: ColourGamePlayStyle,
  baseName: string
): Record<`rgbBase${string}`, number> => {
  let maxClicksToGenerate = 0;
  let coloursToGenerate = 0;
  const result: Record<`rgbBase${string}`, number> = {};

  // --- check maxClicksPerColour & coloursToGenerate via colourLevelDetails
  switch (playStyle) {
    case "random":
      maxClicksToGenerate = colourLevelDetails.random.maxClicksPerColour;
      coloursToGenerate = colourLevelDetails.random.coloursAvail;
      break;
    case "levelled":
      maxClicksToGenerate = colourLevelDetails.level1.maxClicksPerColour;
      coloursToGenerate = colourLevelDetails.level1.coloursAvail;
      break;
    default:
      throw new Error("No Play Style Selected to initialise Colour Game!");
  }
  //   console.log(maxClicksToGenerate, coloursToGenerate);

  // --- generate proportions
  const baseObject = getColourMatchBase(baseName);
  const rgbBaseKeys = getRGBBaseKeys(baseObject);

  // Note Object.keys() will give array of keys in order of when they were added
  for (let i = 0; i < coloursToGenerate; i++) {
    const randomiseClicks = Math.floor(
      Math.random() * (maxClicksToGenerate + 1)
    );
    result[rgbBaseKeys[i]] = randomiseClicks;
  }

  return result;
};

// const rgbFromColourProportions = (
//   proportions: Record<string, number>,
//   base: string
// ) => {
//   const baseColoursRGB: Record<string, RGB> = {};

//   // extract base Object
//   if (!(base in colourMatchBases)) {
//     throw new Error(`Unable to find base, ${base}, to initialise Colour Game!`);
//   }
//   const baseObject = colourMatchBases[base];

//   // Get the keys that start with "rgbBase"
//   const rgbBaseKeys = Object.keys(baseObject).filter((key) =>
//     /^rgbBase[A-Z]/.test(key)
//   );
//   for (const rgbBaseKey of rgbBaseKeys) {
//     if (rgbBaseKey in baseObject) {
//       //   baseColoursRGB[rgbBaseKey] = baseObject[rgbBaseKey as `rgbBase${string}`]; // TODO: Type Assertion issues
//       // } else {
//       throw new Error(`Cannot find ${rgbBaseKey} in ${baseObject.baseName}`);
//     }
//   }

//   // --- check baseType via colourMatchBases
//   const { baseType } = baseObject;
//   if (baseType !== "Additive" && baseType !== "Subtractive") {
//     throw new Error(`Base Type, ${baseType} not identified.`);
//   }

//   //   given proportions, type, and colourMatchBases, mix it
//   return rgbMixFromColourProportions(proportions, baseType, baseColoursRGB);
// };

// console.log(randomiseColourProportions("levelled", "RGBW"));

export {
  getRGBBaseKeys,
  rgbMixFromColourProportions,
  randomiseColourProportions,
  getColourMatchBase,
};
