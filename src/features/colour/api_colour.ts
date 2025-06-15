import {
  type ColourSchemeList,
  type ColourData,
  type ColourAPI,
} from "../../constants/colour/colourConstants";
import {
  RGBifyUrl,
  stringifyRGB,
} from "../../pages/games/colour/utils/colourRGBUtils";

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
  colourId: string,
  colourSchemeList: ColourSchemeList
): Promise<ColourData | undefined> => {
  //rgbString must be in the format "(xx,xx,xx)"
  const RGBstring = stringifyRGB(RGBifyUrl(colourId));
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

const showNextNamedColourHEX = async (
  colourId: string
): Promise<string | undefined> => {
  const { R, G, B } = RGBifyUrl(colourId);
  let finding = true;

  let newR = R,
    newG = G,
    newB = B;

  try {
    while (finding) {
      if (newB < 255) {
        newB += 1;
      } else if (newG < 255) {
        newG += 1;
        newB = 0;
      } else if (newR < 255) {
        newR += 1;
        newG = 0;
        newB = 0;
      } else {
        return "#000000";
      }

      console.log(stringifyRGB({ R: newR, G: newG, B: newB }));
      const colourSeedUrl = `${BASE_COLOUR_URL}id?rgb=rgb(${newR},${newG},${newB})`;

      const colourSeedPromiseResult: ColourAPI = await fetchJson(colourSeedUrl);
      if (colourSeedPromiseResult.name.exact_match_name) {
        finding = false;
        return colourSeedPromiseResult.hex.value;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// const result = await showNextNamedColourHEX("0-1-252");
// console.log(result);

export { show, showNextNamedColourHEX };
