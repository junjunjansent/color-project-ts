import debug from "debug";
const log = debug("colours:ColourAnalysis");

import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  RGBUrlRegex,
  colourSchemes,
  type ColourData,
} from "../../../features/colour/colourConstants";
import {
  RGBifyUrl,
  convertHEXtoRGB,
  urlifyRGB,
} from "../../../features/colour/colourRGBHandler";
import * as api_colour from "../../../features/colour/api_colour";
import * as api_airtableColour from "../../../features/colour/api_airtableColour";
import { PATHS } from "../../../routes/paths";
import ErrorPage from "../../../components/ErrorPage";
import Loader from "../../../components/Loader";

const ColourAnalysis = () => {
  // get details of site
  const { id } = useParams();
  if (!id || !RGBUrlRegex.test(id)) {
    return <ErrorPage />;
  }
  const rgb = RGBifyUrl(id);

  // define states
  const [colourData, setColourData] = useState<ColourData>();
  const [isSavedColour, setIsSavedColour] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSelectedColourAnalysis = (hex: string = "#000000") => {
    const rgb = convertHEXtoRGB(hex); //TODO type guard
    const rgbUrl = urlifyRGB(rgb);
    navigate(PATHS.GAME.COLOUR.COLOUR_ID(rgbUrl));
  };

  const handleSaveToList = async () => {
    //TODO: explore react-toastify
    // saved - navigate function & ignore
    // show a notification
    log("Saving Colour");

    const cleanedColourData = {
      fields: {
        colourId: id,
        hex: colourData?.hex.value ?? "",
        name: colourData?.name?.exact_match_name ? colourData.name.value : "",
      },
    };

    await api_airtableColour.create(cleanedColourData);
    setIsSavedColour(true);
  };

  useEffect(() => {
    const fetchColourDatas = async () => {
      const newColourData = await api_colour.show(rgb, colourSchemes);
      setColourData(newColourData);
    };

    const checkSavedColour = async () => {
      const savedColourList = await api_airtableColour.index();
      setIsSavedColour(
        savedColourList.some(
          (savedColour: api_airtableColour.AirtableColourListField) =>
            savedColour.colourId === id
        )
      );
    };

    const renderPromises = async () => {
      setLoading(true);
      await Promise.all([fetchColourDatas(), checkSavedColour()]);
      setLoading(false);
    };

    renderPromises();
    // log(colourData);
  }, [id]);

  const colourNameSection = (
    <>
      <img
        src={
          colourData?.name?.exact_match_name
            ? colourData?.image?.named
            : colourData?.image?.bare
        }
        alt=""
      />
      <h3>
        <strong>Name: </strong>

        {colourData?.name?.exact_match_name
          ? colourData?.name?.value
          : "Unnamed"}
      </h3>

      {isSavedColour ? (
        <button>Saved</button>
      ) : (
        <button onClick={handleSaveToList}>Save Colour :)</button>
      )}

      {colourData?.name?.exact_match_name || (
        <div>
          <p>
            Not all colours are named! but you can find the closest named colour
            here:{" "}
          </p>
          <button
            onClick={() =>
              handleSelectedColourAnalysis(colourData?.name?.closest_named_hex)
            }
          >
            {colourData?.name?.closest_named_hex}
          </button>
        </div>
      )}
    </>
  );

  // Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h1>Colour Analysis</h1>
      <section>{colourNameSection}</section>

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
        {colourData?.schemes.map((scheme, indexScheme) => {
          return (
            <article key={indexScheme}>
              <h5>{scheme.mode}</h5>
              {scheme.colors.map((color, indexColour) => {
                return (
                  <button
                    key={indexColour}
                    style={{ backgroundColor: color.hex.value }}
                    onClick={() =>
                      handleSelectedColourAnalysis(color.hex.value)
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

      {/* <pre>{JSON.stringify(colourData, null, 2)}</pre> */}
    </>
  );
};

export default ColourAnalysis;
