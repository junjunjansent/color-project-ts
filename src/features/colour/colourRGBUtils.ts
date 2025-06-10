import colourEmotionsVariationDataArr from "./colourEmotionsVariationDataArr.json";
import colourEmotionsMainDataArr from "./colourEmotionsMainDataArr.json";
import { type RGB, type ColourEmotionsData } from "./colourConstants";

const randomiseRGB = () => {
  const RValue = Math.floor(Math.random() * 256);
  const GValue = Math.floor(Math.random() * 256);
  const BValue = Math.floor(Math.random() * 256);
  return { R: RValue, G: GValue, B: BValue };
};

const urlifyRGB = (rgb: RGB): string => {
  const RGBUrl = `${rgb.R}-${rgb.G}-${rgb.B}`;
  return RGBUrl;
};

const RGBifyUrl = (urlRGB: string): RGB => {
  const RGBArray = urlRGB.split("-").map((value) => parseInt(value));
  return { R: RGBArray[0], G: RGBArray[1], B: RGBArray[2] };
};

const stringifyRGB = (rgb: RGB) => {
  const RGBString = `(${rgb.R},${rgb.G},${rgb.B})`;
  return RGBString;
};

const convertRGBtoHEX = (rgb: RGB): string => {
  // 16 million types of colours
  if (
    !(
      rgb.R >= 0 &&
      rgb.R <= 255 &&
      rgb.G >= 0 &&
      rgb.G <= 255 &&
      rgb.B >= 0 &&
      rgb.B <= 255
    )
  ) {
    console.log("invalid RGB value");
  }

  const toHexadec = (n: number) =>
    n.toString(16).padStart(2, "0").toUpperCase();
  return "#" + toHexadec(rgb.R) + toHexadec(rgb.G) + toHexadec(rgb.B);
};

const convertHEXtoRGB = (hex: string): RGB => {
  // note HTML prefers HEX
  // The format is #RRGGBB , where:
  // RR = intensity of red (00 to FF).
  // GG = intensity of green (00 to FF).
  // BB = intensity of blue (00 to FF).

  const RValue = parseInt(hex.slice(1, 3), 16);
  const GValue = parseInt(hex.slice(3, 5), 16);
  const BValue = parseInt(hex.slice(5, 7), 16);
  return { R: RValue, G: GValue, B: BValue };
};

const getClosestEmotionsData = (rgb: RGB): ColourEmotionsData => {
  // requires colourEmotionsVariationsData.json with .rgb values
  // efficient for now... for ~100 variations
  // calculate Euclidean distance, not a good human perception evaluator
  let minEuDist = Infinity;
  let result: ColourEmotionsData | null = null;

  for (const variation of colourEmotionsVariationDataArr) {
    const euDist =
      (variation.rgb.R - rgb.R) ** 2 +
      (variation.rgb.G - rgb.G) ** 2 +
      (variation.rgb.B - rgb.B) ** 2;

    if (euDist < minEuDist) {
      minEuDist = euDist;

      const mainColourDetails = colourEmotionsMainDataArr.find(
        (main) => main.name === variation.belongsTo
      );
      if (!mainColourDetails) {
        throw new Error("Main colour Details not found.");
      }
      result = { ...variation, mainColour: mainColourDetails };
    }
  }

  if (!result) {
    throw new Error("Closest colour variation not found.");
  }
  return result;
};

export {
  randomiseRGB,
  urlifyRGB,
  RGBifyUrl,
  stringifyRGB,
  convertRGBtoHEX,
  convertHEXtoRGB,
  getClosestEmotionsData,
};
