import {
  type ColourMatchBaseNames,
  type ColourGamePlayStyle,
  colourMatchBases,
  colourLevelDetails,
} from "./colourMatchConstants";

// ----------- Pure functions

// const rgbFromColourProportions = () => {};

// ----------- Impure functions - Read Values from colourMatchBases & colourLevelDetails

const randomiseColourProportions = (
  playStyle: ColourGamePlayStyle,
  base: ColourMatchBaseNames
): Record<string, number> => {
  let maxClicksToGenerate = 0;
  let coloursToGenerate = 0;
  const result: Record<string, number> = {}; //need to type so that i can index and store values later

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
  console.log(maxClicksToGenerate, coloursToGenerate);

  // --- generate proportions and get rgbBase keys via colourMatchBases
  const baseObject = colourMatchBases[base];

  // Get the keys that start with "rgbBase"
  const rgbBaseKeys = Object.keys(baseObject).filter((key) =>
    /^rgbBase[A-Z]/.test(key)
  );

  // Note Object.keys() will give array of keys in order of when they were added
  for (let i = 0; i < coloursToGenerate; i++) {
    const randomiseClicks = Math.floor(
      Math.random() * (maxClicksToGenerate + 1)
    );
    result[rgbBaseKeys[i]] = randomiseClicks;
  }

  return result;
};

const rgbFromColourProportions = () => {
  // --- check baseType via colourMatchBases
};

// console.log(randomiseColourProportions("levelled", "RGBW"));

export { randomiseColourProportions, rgbFromColourProportions };
