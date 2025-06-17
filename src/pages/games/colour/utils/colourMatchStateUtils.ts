import {
  type ColourMatchBase,
  type ColourMatchMode,
  colourMatchBases,
  colourMatchLevelDetails,
} from "../../../../constants/colour/colourMatchConstants";

// ----------- Pure functions

const getRGBBaseKeys = (baseObject: ColourMatchBase): `rgbBase${string}`[] => {
  // type predicate via is to ensure any key selected has type required
  return Object.keys(baseObject).filter((key): key is `rgbBase${string}` =>
    /^rgbBase[A-Z]/.test(key)
  );
};

// ----------- Impure functions - Read Values from colourMatchBases & colourMatchLevelDetails

const getColourMatchBase = (baseName: string): ColourMatchBase => {
  // extract base Object via colourMatchBases
  if (!(baseName in colourMatchBases)) {
    throw new Error(`Unable to find base, ${baseName} in getColourMatchBase`);
  }
  const baseObject = colourMatchBases[baseName];
  return baseObject;
};

const getColourMatchLevelDetails = (currentLevel: number | "random") => {
  const key = currentLevel === "random" ? "random" : `level${currentLevel}`;
  return colourMatchLevelDetails[key];
};

const setColourProportions = (
  matchMode: ColourMatchMode,
  baseName: string,
  setValue: "random" | number = "random"
): Record<`rgbBase${string}`, number> => {
  let maxClicksToGenerate = 0;
  let coloursToGenerate = 0;
  const result: Record<`rgbBase${string}`, number> = {};

  // --- check maxClicksPerColour & coloursToGenerate via colourMatchLevelDetails
  switch (matchMode) {
    case "random":
      maxClicksToGenerate = colourMatchLevelDetails.random.maxClicksPerColour;
      coloursToGenerate = colourMatchLevelDetails.random.coloursAvail;
      break;
    case "levelled":
      maxClicksToGenerate = colourMatchLevelDetails.level1.maxClicksPerColour;
      coloursToGenerate = colourMatchLevelDetails.level1.coloursAvail;
      break;
  }
  //   console.log(maxClicksToGenerate, coloursToGenerate);

  // --- generate proportions
  const baseObject = getColourMatchBase(baseName);
  const rgbBaseKeys = getRGBBaseKeys(baseObject);

  // Note Object.keys() will give array of keys in order of when they were added
  for (let i = 0; i < coloursToGenerate; i++) {
    if (setValue === "random") {
      const randomiseClicks = Math.floor(
        Math.random() * (maxClicksToGenerate + 1)
      );
      result[rgbBaseKeys[i]] = randomiseClicks;
    } else {
      result[rgbBaseKeys[i]] = setValue;
    }
  }

  return result;
};

export {
  getRGBBaseKeys,
  setColourProportions,
  getColourMatchLevelDetails,
  getColourMatchBase,
};
