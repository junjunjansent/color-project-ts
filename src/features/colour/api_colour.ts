import type { RGB } from "./colourData";
import { stringifyRGB } from "./colourData";

const BASE_COLOUR_URL = "https://www.thecolorapi.com/";

const show = async (rgb: RGB) => {
  //rgbString must be in the format "(xx,xx,xx)"
  const RGBstring = stringifyRGB(rgb);
  const schemeColourCount = 6;
  const url = `${BASE_COLOUR_URL}scheme?rgb=rgb${RGBstring}&format=json&count=${schemeColourCount}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => {
      console.log(error);
      return null;
    });
};

console.log(show({ R: 0, G: 0, B: 0 }));

export { show };
