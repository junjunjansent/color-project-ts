import debug from "debug";
const log = debug("colours:ColourAnalysis");

import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  colourSchemes,
  type ColourData,
} from "../../../features/colour/colourConstants";
import {
  RGBifyUrl,
  convertHEXtoRGB,
  urlifyRGB,
} from "../../../features/colour/colourRGBHandler";
import * as api_colour from "../../../features/colour/api_colour";
import { PATHS } from "../../../routes/paths";
import ErrorPage from "../../../components/ErrorPage";
import Loading from "../../../components/Loader";

const ColourAnalysis = () => {
  // get details of site
  const { id } = useParams();
  if (!id) {
    return <ErrorPage />;
  }
  const rgb = RGBifyUrl(id);

  // define states
  const [colourData, setColourData] = useState<ColourData>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSelectedColourAnalysis = (hex: string = "#000000") => {
    const rgb = convertHEXtoRGB(hex); //TODO type guard
    const rgbUrl = urlifyRGB(rgb);
    navigate(PATHS.GAME.COLOUR.COLOUR_ID(rgbUrl));
  };

  useEffect(() => {
    const fetchColourDatas = async () => {
      setLoading(true);
      const newColourData = await api_colour.show(rgb, colourSchemes);
      setColourData(newColourData);
      setLoading(false);
    };
    fetchColourDatas();
    log(colourData);
  }, [id]);

  const closeMatchName = (
    <>
      <h3>
        <strong>Name: </strong>
        {colourData?.name?.exact_match_name
          ? colourData?.name?.value
          : "Unnamed"}
      </h3>
      {colourData?.name?.exact_match_name ? (
        <></>
      ) : (
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
    return <Loading />;
  }

  return (
    <>
      <h1>Colour Analysis</h1>
      <section>
        <img src={colourData?.image?.named} alt="" />
        {/* <h2>{stringifyRGB(rgb)}</h2> */}
        {closeMatchName}
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
                    {color.hex.value} <br />
                    {color.rgb.value}
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
