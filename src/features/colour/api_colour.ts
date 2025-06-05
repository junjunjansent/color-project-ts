import type { RGB } from "./colourData";
import { stringifyRGB } from "./colourData";

const BASE_COLOUR_URL = "https://www.thecolorapi.com/";

const show = async (rgb: RGB) => {
  //rgbString must be in the format "(xx,xx,xx)"
  const RGBstring = stringifyRGB(rgb);
  const schemeColourCount = 6;
  const url = `${BASE_COLOUR_URL}scheme?rgb=rgb${RGBstring}&format=json&count=${schemeColourCount}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};

// const result = await show({ R: 21, G: 5, B: 0 });
// console.log(result);

export { show };
