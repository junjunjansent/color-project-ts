import type { RGB, ColourSchemeList, ColourData } from "../colourConstants";
import { stringifyRGB } from "../colourRGBUtils";

const BASE_COLOUR_URL = "https://www.thecolorapi.com/";

// ----------- Function Definitions

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP Status: ${res.status}`);
  }
  return res.json();
};

const show = async (
  rgb: RGB,
  colourSchemeList: ColourSchemeList
): Promise<ColourData | undefined> => {
  //rgbString must be in the format "(xx,xx,xx)"
  const RGBstring = stringifyRGB(rgb);
  const schemeColourCount = 6;

  // obtain seed Object as the Promise, start promise, handle errors later
  const colourSeedUrl = `${BASE_COLOUR_URL}id?rgb=rgb${RGBstring}`;
  const colourSeedPromise = fetchJson(colourSeedUrl);

  // obtain list of colour scheme Objects as Promises
  const colourSchemePromises = Object.keys(colourSchemeList).map(
    (colourSchemeKey) => {
      const colourSchemeUrl = `${BASE_COLOUR_URL}scheme?rgb=rgb${RGBstring}&format=json&count=${schemeColourCount}&mode=${colourSchemeKey}`;
      return fetchJson(colourSchemeUrl);
    }
  );

  // promise all clean up and error
  try {
    const [seedPromiseResult, ...promiseResults] = await Promise.all([
      colourSeedPromise,
      ...colourSchemePromises,
    ]);
    return { ...seedPromiseResult, schemes: promiseResults };
  } catch (error) {
    console.log(error);
  }
};

// const result = await show({ R: 21, G: 5, B: 0 });
// console.log(result);

export { show };
