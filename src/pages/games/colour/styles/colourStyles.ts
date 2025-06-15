import { convertHEXtoRGB } from "../utils/colourRGBUtils";
import { type RGB } from "../../../../constants/colour/colourConstants";

const getContrastRatio = (lumiA: number, lumiB: number) => {
  // Contrast ratio is calculated as (L1 + 0.05) / (L2 + 0.05), to adjust for human perception
  // https://www.w3.org/TR/WCAG20/#contrast-ratiodef
  const lumi1 = Math.max(lumiA, lumiB);
  const lumi2 = Math.min(lumiA, lumiB);
  return (lumi1 + 0.05) / (lumi2 + 0.05);
};

const getLuminance = ({ R, G, B }: RGB): number => {
  // Based on Luminance calculation of Radiocommunication Sector of the International Telecommunication Union (ITU-R)
  // https://www.w3.org/TR/WCAG20/relative-luminance.xml
  const newRGBArr = [R, G, B].map((value) => {
    if (value / 255 <= 0.03928) {
      return value / 255 / 12.92;
    } else {
      return Math.pow((value / 255 + 0.055) / 1.055, 2.4);
    }
  });

  return 0.2126 * newRGBArr[0] + 0.7152 * newRGBArr[1] + 0.0722 * newRGBArr[2];
};

const chooseTextColour = (hex: string | undefined): string => {
  // from stack overflow lol
  const hexRegex = /^#([A-Fa-f0-9]{6})$/;

  if (!hex || !hexRegex.test(hex)) {
    console.warn(`Hex is not valid, ${hex}. Black text has been chosen`);
    return "#000000"; //default black
  }
  const rgb = convertHEXtoRGB(hex);
  const lumiColour = getLuminance(rgb);
  const lumiWhite = getLuminance(convertHEXtoRGB("#FFFFFF"));
  const lumiBlack = getLuminance(convertHEXtoRGB("#000000"));

  // check contrast
  const contrastWhiteRatio = getContrastRatio(lumiColour, lumiWhite);
  const contrastBlackRatio = getContrastRatio(lumiColour, lumiBlack);

  // Return black for bright colors, white for dark colors
  return contrastBlackRatio > contrastWhiteRatio ? "#000000" : "#FFFFFF";
};

export { chooseTextColour };
