import { PATHS } from "./paths";
import {
  convertHEXtoRGB,
  urlifyRGB,
} from "../pages/games/colour/utils/colourRGBUtils";

// note, cannot use Hooks outside of React

const handleSelectedColourToNavigate = (
  hex: string = "#000000",
  navigate: (path: string) => void
) => {
  const rgb = convertHEXtoRGB(hex); //TODO type guard
  const rgbUrl = urlifyRGB(rgb);
  navigate(PATHS.GAME.COLOUR.COLOUR_ID(rgbUrl));
};

export { handleSelectedColourToNavigate };
