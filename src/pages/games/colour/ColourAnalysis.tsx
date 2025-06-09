import debug from "debug";
const log = debug("colours:ColourAnalysis");

import { useParams, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import styles from "../../../styles/colour/colourAnalysis.module.css";

import {
  RGBUrlRegex,
  colourSchemeList,
  type ColourData,
  type ColourSchemeAPI,
} from "../../../features/colour/colourConstants";
import { handleSelectedColourToNavigate } from "../../../routes/navigateHandlers";
import {
  RGBifyUrl,
  // convertHEXtoRGB,
  // urlifyRGB,
} from "../../../features/colour/colourRGBHandler";
import * as api_colour from "../../../features/colour/api_colour";

import ErrorPage from "../../../components/ErrorPage";
import Loader from "../../../components/Loader";
import ColourNameCmpnt from "../../../components/colour/ColourNameCmpnt";
import ColourEmotionsCmpnt from "../../../components/colour/ColourEmotionsCmpnt";
import { chooseTextColour } from "../../../styles/colour/colourStyles";

interface ColourSchemeDetails {
  name: string;
  hexColours: string[];
}

const ColourAnalysis = () => {
  // get details of site
  const { colourId } = useParams();
  if (!colourId || !RGBUrlRegex.test(colourId)) {
    return <ErrorPage />;
  }
  const rgb = RGBifyUrl(colourId);

  // define states
  const [colourData, setColourData] = useState<ColourData>();
  const [colourScheme, setColourScheme] = useState<ColourSchemeDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSelectedColourScheme = (scheme: ColourSchemeAPI) => {
    const cleanedColourScheme = {
      name: colourSchemeList[scheme.mode],
      hexColours: scheme.colors.map((color) => color.hex.value),
    };
    setColourScheme(cleanedColourScheme);
    log(cleanedColourScheme);
  };

  useEffect(() => {
    const loadColourData = async () => {
      // using try/catch block to setColourData properly
      try {
        setLoading(true);
        const newColourData = await api_colour.show(rgb, colourSchemeList);
        setColourData(newColourData);

        // initialise theme if it exists
        if (newColourData?.schemes?.[0]) {
          handleSelectedColourScheme(newColourData.schemes[0]);
        }
      } catch (error) {
        console.error("Failed to load colour:", error);
        setColourData(undefined);
      } finally {
        setLoading(false);
      }
    };

    loadColourData();
    // log(colourData);
  }, [colourId]);

  // Styles Setter
  // using useMemo to avoid CSS declaration every rerender
  // type it into format of CSS Variable (which are basically objects)
  const cssVariables = useMemo((): Record<`--${string}`, string> => {
    if (!colourScheme) {
      return {};
    }

    const [colour1, colour2, colour3, colour4, colour5] =
      colourScheme.hexColours;

    return {
      // Main Bg --> Colour 1
      // Buttons--> Colour 2
      // Article --> Colour 3
      // Article Buttons --> Colour 4
      // Title --> Colour 5
      "--colour-bg": colour1,
      "--colour-title": colour5,
      "--colour-btn": colour2,
      "--colour-article": colour3,
      "--colour-article-btn": colour4,
      "--colour-text": chooseTextColour(colour1),
      "--colour-btn-text": chooseTextColour(colour2),
      "--colour-article-text": chooseTextColour(colour3),
      "--colour-article-btn-text": chooseTextColour(colour4),
    };
  }, [colourScheme]);

  // Loader
  if (loading) {
    return <Loader />;
  } else if (!colourData) {
    return (
      <>
        <ErrorPage /> <p>Failed to load Colour!</p>
      </>
    );
  }

  return (
    <div
      className={styles["colour-analysis-default-scheme"]}
      style={cssVariables}
    >
      <h1>Colour Analysis</h1>
      <section className={styles["name-and-specs"]}>
        <ColourNameCmpnt colourId={colourId} colourData={colourData} />
        <div>
          <h4>Colour Specs</h4>
          <ul>
            <li>
              {" "}
              <strong>Hex: </strong>
              {colourData.hex.value}
            </li>
            <li>
              {" "}
              <strong>RGB: </strong>
              {colourData.rgb.value}
            </li>
            <li>
              {" "}
              <strong>HSL: </strong>
              {colourData.hsl.value}
            </li>
            <li>
              {" "}
              <strong>CMYK: </strong>
              {colourData.cmyk.value}
            </li>
          </ul>
        </div>
      </section>

      <section></section>

      <section>
        <h3>Themes</h3>
        <h6>Current Theme: {colourScheme?.name ?? ""}</h6>
        {colourData?.schemes.map((scheme, indexScheme) => {
          return (
            <article key={indexScheme}>
              <h5>{colourSchemeList[scheme.mode]}</h5>
              <button onClick={() => handleSelectedColourScheme(scheme)}>
                See Theme
              </button>
              {scheme.colors.map((color) => {
                return (
                  <button
                    key={color.hex.value}
                    style={{
                      backgroundColor: color.hex.value,
                      color: chooseTextColour(color.hex.value),
                    }}
                    onClick={() =>
                      handleSelectedColourToNavigate(color.hex.value, navigate)
                    }
                  >
                    {color.rgb.value}
                    <br />
                    {color.hex.value}
                  </button>
                );
              })}
            </article>
          );
        })}
      </section>

      <section>
        <ColourEmotionsCmpnt rgb={rgb} />
      </section>

      {/* <pre>{JSON.stringify(colourData, null, 2)}</pre> */}
    </div>
  );
};

export default ColourAnalysis;
