import debug from "debug";
const log = debug("colours:Component:ColourEmotionsCompt");

import { useEffect, useState } from "react";

import type { ColourData } from "../../features/colour/colourConstants";
import ErrorPage from "../ErrorPage";
import Loader from "../Loader";

interface ColourEmotionsCmpntProp {
  id: string;
  colourData: ColourData | undefined;
}

const ColourEmotionsCmpnt = ({ id, colourData }: ColourEmotionsCmpntProp) => {
  // define Hooks
  const [loading, setLoading] = useState<boolean>(true);
  log(id);

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
      <h4>Colour Emotions</h4>
      <article style={{ backgroundColor: "#000000" }}>
        <h5>Closest Variation: {}</h5>
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
