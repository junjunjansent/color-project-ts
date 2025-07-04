// import debug from "debug";
// const log = debug("colours:Component:ColourEmotionsCompt");

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { type ColourEmotionsData } from "../../../../constants/colour/colourConstants";
import ErrorPage from "../../../../components/ErrorPage";
import Loader from "../../../../components/Loader";
import {
  convertRGBtoHEX,
  getClosestEmotionsData,
  RGBifyUrl,
  stringifyRGB,
  urlifyRGB,
} from "../utils/colourRGBUtils";
import { handleSelectedColourToNavigate } from "../../../../routes/navigateHandlers";
import { chooseTextColour } from "../styles/colourStyles";

interface ColourEmotionsCmpntProp {
  colourId: string;
}

const ColourProfileEmotionsCmpnt = ({ colourId }: ColourEmotionsCmpntProp) => {
  // define Hooks
  const [emotionsData, setEmotionsData] = useState<ColourEmotionsData>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // log(stringifyRGB(rgb));

  useEffect(() => {
    setLoading(true);
    // no need to use await because json is compiled (via import & loaded statically), so function would be synchronous
    const newEmotionsData = getClosestEmotionsData(RGBifyUrl(colourId));
    setEmotionsData(newEmotionsData);
    setLoading(false);
  }, [colourId]);

  // Loader & Error
  if (loading) {
    return <Loader />;
  } else if (!emotionsData) {
    return <ErrorPage />;
  }

  // check is RGB values are the same
  const isSameAsVariation = colourId === urlifyRGB(emotionsData.rgb);
  const isSameAsMainColour =
    colourId === urlifyRGB(emotionsData.mainColour.rgb);

  return (
    <>
      <h3>Colour Emotions</h3>
      <p>
        Different colours elicit different emotions and how you experience these
        colours would be shaped by the culture you grew up in, as well as how
        you previously felt when interacting with objects around you. Based on
        the colour selected, the closest colour variations have been picked to
        give you some information on this choice. Note: these were derived from{" "}
        <a href="https://www.empower-yourself-with-color-psychology.com/meaning-of-colors.html">
          this website
        </a>
        .
      </p>

      <article>
        <h5>Closest Variation with Emotion Data: {emotionsData.name}</h5>
        <p>
          <small>
            Obtained from calculating closest Euclidean Distance from RGB values
            of data base.
          </small>
        </p>
        <div>
          <p>
            <strong>RGB: </strong>rgb{stringifyRGB(emotionsData.rgb)}
          </p>
          <p>
            <strong>HEX: </strong>
            {emotionsData.hex}
          </p>
          <div>
            <strong>Description: </strong>
            <ul>
              {emotionsData.description.map((description, index) => {
                return <li key={index}>{description}</li>;
              })}
            </ul>
          </div>
          {isSameAsVariation || emotionsData.isMainColour || (
            <button
              style={{
                backgroundColor: emotionsData.hex,
                color: chooseTextColour(emotionsData.hex),
              }}
              onClick={() =>
                handleSelectedColourToNavigate(emotionsData.hex, navigate)
              }
            >
              See this Variation: {emotionsData.hex}
            </button>
          )}
        </div>
      </article>

      <article>
        <h5>Overarching Colour & Associated Emotions</h5>
        <p>
          {" "}
          Out of 16 main colours, your colour is most associated to:{" "}
          <strong>{emotionsData.mainColour.name}</strong>
        </p>
        <p>
          <small>
            Others were: Red, Orange, Yellow, Green, Blue, Indigo, Purple,
            Turquoise, Pink, Magenta, Brown, Gray, Black, White, Silver, Gold.
          </small>
        </p>
        <div>
          <p>
            <strong>RGB: </strong>rgb{stringifyRGB(emotionsData.mainColour.rgb)}
          </p>
          <p>
            <strong>HEX: </strong>
            {convertRGBtoHEX(emotionsData.mainColour.rgb)}
          </p>

          {isSameAsMainColour || (
            <button
              style={{
                backgroundColor: convertRGBtoHEX(emotionsData.mainColour.rgb),
                color: chooseTextColour(
                  convertRGBtoHEX(emotionsData.mainColour.rgb)
                ),
              }}
              onClick={() =>
                handleSelectedColourToNavigate(
                  convertRGBtoHEX(emotionsData.mainColour.rgb),
                  navigate
                )
              }
            >
              See this Variation: {convertRGBtoHEX(emotionsData.mainColour.rgb)}
            </button>
          )}
        </div>
        <div>
          <h6>Represents: </h6>
          <ul>
            {emotionsData.mainColour.represents.map((represent, index) => {
              return (
                <li key={index}>
                  <strong>{represent.label}: </strong>
                  {represent.description}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h6>Effects: </h6>
          <ul>
            {emotionsData.mainColour.effects.map((represent, index) => {
              return (
                <li key={index}>
                  <strong>{represent.label}: </strong>
                  {represent.description}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h6>Traits: </h6>
          <div>
            <ul>
              <li>
                Positive
                <ul>
                  {emotionsData.mainColour.traits.positive.map(
                    (posTrait, index) => {
                      return <li key={index}>{posTrait}</li>;
                    }
                  )}
                </ul>
              </li>
              <li>
                Negative{" "}
                <ul>
                  {emotionsData.mainColour.traits.negative.map(
                    (negTrait, index) => {
                      return <li key={index}>{negTrait}</li>;
                    }
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </article>

      {/* <pre>{JSON.stringify(emotionsData, null, 2)}</pre> */}
    </>
  );
};

export default ColourProfileEmotionsCmpnt;
