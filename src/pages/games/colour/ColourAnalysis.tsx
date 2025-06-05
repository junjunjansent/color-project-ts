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
  const { id } = useParams();
  if (!id || !RGBUrlRegex.test(id)) {
    return <ErrorPage />;
  }
  const rgb = RGBifyUrl(id);

  // define states
  const [colourData, setColourData] = useState<ColourData>();
  const [colourScheme, setColourScheme] = useState<ColourSchemeDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSelectedColourScheme = (scheme: ColourSchemeAPI) => {
    const cleanedColourScheme = {
      name: scheme.mode,
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
  }, [id]);

  // const colourNameSection = (
  //   <>
  //     <img
  //       src={
  //         colourData?.name?.exact_match_name
  //           ? colourData?.image?.named
  //           : colourData?.image?.bare
  //       }
  //       alt=""
  //     />
  //     <h3>
  //       <strong>Name: </strong>

  //       {colourData?.name?.exact_match_name
  //         ? colourData?.name?.value
  //         : "Unnamed"}
  //     </h3>

  //     {isSavedColour ? (
  //       <button>Saved</button>
  //     ) : (
  //       <button onClick={handleSaveToList}>Save Colour :)</button>
  //     )}

  //     {colourData?.name?.exact_match_name || (
  //       <div>
  //         <p>
  //           Not all colours are named! but you can find the closest named colour
  //           here:{" "}
  //         </p>
  //         <button
  //           onClick={() =>
  //             handleSelectedColourAnalysis(colourData?.name?.closest_named_hex)
  //           }
  //         >
  //           {colourData?.name?.closest_named_hex}
  //         </button>
  //       </div>
  //     )}
  //   </>
  // );

  // Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h1>Colour Analysis</h1>
      {/* <section>{colourNameSection}</section> */}
      <section>
        <ColourNameCmpnt id={id} colourData={colourData} />
      </section>

      <section>
        <h4>Categorisation</h4>
        <p>
          <strong>Hex: </strong>
          {colourData?.hex?.value}
        </p>
        <p>
          <strong>RGB: </strong>
          {colourData?.rgb?.value}
        </p>
        <p>
          <strong>HSL: </strong>
          {colourData?.hsl?.value}
        </p>
        <p>
          <strong>CMYK: </strong>
          {colourData?.cmyk?.value}
        </p>
      </section>

      <section>
        <h4>Themes</h4>
        <h6>Current Theme: {colourScheme?.name ?? ""}</h6>
        {colourData?.schemes.map((scheme, indexScheme) => {
          return (
            <article key={indexScheme}>
              <h5>{scheme.mode}</h5>
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
        <ColourEmotionsCmpnt id={id} colourData={colourData} />
      </section>

      {/* <pre>{JSON.stringify(colourData, null, 2)}</pre> */}
    </>
  );
};

export default ColourAnalysis;
