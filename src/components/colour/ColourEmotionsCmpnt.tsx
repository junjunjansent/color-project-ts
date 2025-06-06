import debug from "debug";
const log = debug("colours:Component:ColourEmotionsCompt");

import { useEffect, useState } from "react";

import type { ColourData } from "../../features/colour/colourConstants";
import ErrorPage from "../ErrorPage";
import Loader from "../Loader";
import {
  RGBifyUrl,
  stringifyRGB,
} from "../../features/colour/colourRGBHandler";

interface ColourEmotionsCmpntProp {
  id: string;
  colourData: ColourData | undefined;
}

const ColourEmotionsCmpnt = ({ id, colourData }: ColourEmotionsCmpntProp) => {
  // define Hooks
  const [loading, setLoading] = useState<boolean>(true);
  log(stringifyRGB(RGBifyUrl(id)));

  useEffect(() => {
    setLoading(false);
  }, []);

  // Loader & Error
  if (!colourData) {
    return <ErrorPage />;
  } else if (loading) {
    return <Loader />;
  }
  return (
    <>
      <h3>Colour Emotions</h3>
      <p>
        Different colours elicit different emotions and how you experience these
        colours would be shaped by the culture you grew up in, as well as how
        you previously felt when interacting with objects around you. Based on
        the colour selected, the closest colour variations have been picked to
        give you some information on this choice. Note these were derived from{" "}
        <a href="https://www.empower-yourself-with-color-psychology.com/meaning-of-colors.html">
          this website
        </a>
        .
      </p>

      <article style={{ backgroundColor: "#000000" }}>
        <h5>Closest Variation with Emotions Data: {}</h5>
        <div>
          <p>{/* rgb value */}</p>
          <p>{/* hex value */}</p>
          <p>{/* name */}</p>
          <button>
            {/* Navigation */}
            See Colour
          </button>
        </div>
        <div>
          <strong>Description: </strong>
          <ul>{/* li elements */}</ul>
        </div>
      </article>

      <article>
        <h5>Overarching Colour & Associated Emotions</h5>
        <p> Out of 16 main colours, your colour is most associated to : {}</p>
        <p>
          <small>
            Red, Orange, Yellow, Green, Blue, Indigo, Purple, Turquoise, Pink,
            Magenta, Brown, Gray, Black, White, Silver, Gold.
          </small>
        </p>
        <div>
          <p>{/* rgb value */}</p>
          <p>{/* hex value */}</p>
          <p>{/* name */}</p>
          <button>
            {/* Navigation */}
            See Colour
          </button>
        </div>
        <div>
          <h6>Represents: </h6>
          <ul>{/* li elements */}</ul>
        </div>
        <div>
          <h6>Effects: </h6>
          <ul>{/* li elements */}</ul>
        </div>
        <div>
          <h6>Traits: </h6>
          <div>
            <ul>{/* li Positive traits */}</ul>
            <ul>{/* li Negative traits */}</ul>
          </div>
        </div>
      </article>
    </>
  );
};

export default ColourEmotionsCmpnt;
