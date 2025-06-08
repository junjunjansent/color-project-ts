import debug from "debug";
const log = debug("colours:ColourAnalysis");

import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
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
    const loadColourDatas = async () => {
      setLoading(true);
      // fetch data
      const newColourData = await api_colour.show(rgb, colourSchemeList);
      setColourData(newColourData);

      // initialise theme if it exists
      if (newColourData?.schemes?.[0]) {
        handleSelectedColourScheme(newColourData.schemes[0]);
      }
      setLoading(false);
    };

    loadColourDatas();
    // log(colourData);
  }, [colourId]);

  // Loader
  if (loading) {
    return <Loader />;
  } else if (!colourData) {
    return <ErrorPage />;
  }

  return (
    <>
      <h1>Colour Analysis</h1>
      {/* <section>{colourNameSection}</section> */}
      <section>
        <ColourNameCmpnt colourId={colourId} colourData={colourData} />
      </section>

      <section>
        <h3>Categorisation</h3>
        <p>
          <strong>Hex: </strong>
          {colourData.hex.value}
        </p>
        <p>
          <strong>RGB: </strong>
          {colourData.rgb.value}
        </p>
        <p>
          <strong>HSL: </strong>
          {colourData.hsl.value}
        </p>
        <p>
          <strong>CMYK: </strong>
          {colourData.cmyk.value}
        </p>
      </section>

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
              {scheme.colors.map((color, indexColour) => {
                return (
                  <button
                    key={indexColour}
                    style={{ backgroundColor: color.hex.value }}
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
    </>
  );
};

export default ColourAnalysis;
