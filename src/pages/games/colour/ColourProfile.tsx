import debug from "debug";
const log = debug("colours:ColourProfile");

import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";

import styles from "../../../styles/colour/colourProfile.module.css";

import {
  RGBUrlRegex,
  colourSchemeList,
  type ColourData,
  type ColourSchemeCore,
  type ColourSchemeAPI,
} from "../../../features/colour/colourConstants";
import { RGBifyUrl } from "../../../features/colour/colourRGBHandler";
import * as api_colour from "../../../features/colour/api_colour";

import ErrorPage from "../../../components/ErrorPage";
import Loader from "../../../components/Loader";
import ColourAboutCmpnt from "../../../components/colour/ColourAboutCmpnt";
import ColourEmotionsCmpnt from "../../../components/colour/ColourEmotionsCmpnt";
import { chooseTextColour } from "../../../styles/colour/colourStyles";
import ColourSchemeCardCmpnt from "../../../components/colour/ColourSchemeCardCmpnt";

const ColourProfile = () => {
  // get details of site
  const { colourId } = useParams();
  if (!colourId || !RGBUrlRegex.test(colourId)) {
    return <ErrorPage />;
  }
  const rgb = RGBifyUrl(colourId);

  // define states
  const [colourData, setColourData] = useState<ColourData>();
  const [colourScheme, setColourScheme] = useState<ColourSchemeCore>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleSelectedColourScheme = (scheme: ColourSchemeAPI) => {
    const cleanedColourScheme: ColourSchemeCore = {
      label: colourSchemeList[scheme.mode],
      mode: scheme.mode,
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

        // initialise scheme if it exists
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
      className={styles["colour-profile-default-scheme"]}
      style={cssVariables}
    >
      <section className={styles["about"]}>
        <ColourAboutCmpnt colourId={colourId} colourData={colourData} />
      </section>

      <section>
        <ColourEmotionsCmpnt rgb={rgb} />
      </section>

      <section>
        <h3>Schemes</h3>
        <h6>Current Scheme: {colourScheme?.label ?? "No label found"}</h6>
        <p>
          Select any of the different available colour schemes to see how they
          would look when applied onto this page! Good schemes (should) create
          harmony, making designs feel unified and easy on the eyes.
        </p>
        <div className={styles["schemes-div"]}>
          {colourData?.schemes.map((scheme) => {
            return (
              <article key={scheme.mode}>
                <ColourSchemeCardCmpnt
                  scheme={scheme}
                  handleSelectedColourScheme={handleSelectedColourScheme}
                  selected={colourScheme?.mode === scheme.mode}
                />
              </article>
            );
          })}
        </div>
      </section>

      {/* <pre>{JSON.stringify(colourData, null, 2)}</pre> */}
    </div>
  );
};

export default ColourProfile;
