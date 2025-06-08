import debug from "debug";
const log = debug("colours:Component:ColourNameCompt");

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { handleSelectedColourToNavigate } from "../../routes/navigateHandlers";
import { type ColourData } from "../../features/colour/colourConstants";
import { type AirtableColourListField } from "../../features/colour/colourConstants";
import * as api_airtableColour from "../../features/colour/api_airtableColour";
import Loader from "../Loader";
import ErrorPage from "../ErrorPage";

interface ColourNameCmpntProp {
  colourId: string;
  colourData: ColourData | undefined;
}

const ColourNameCmpnt = ({ colourId, colourData }: ColourNameCmpntProp) => {
  // define State
  const [loading, setLoading] = useState<boolean>(true);
  const [isSavedColour, setIsSavedColour] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSaveToList = async () => {
    //TODO: explore react-toastify
    // saved - navigate function & ignore
    // show a notification
    log("Saving Colour");

    const cleanedColourData = {
      fields: {
        colourId: colourId,
        hex: colourData?.hex.value ?? "",
        name: colourData?.name?.exact_match_name ? colourData.name.value : "",
      },
    };

    await api_airtableColour.create(cleanedColourData);
    setIsSavedColour(true);
  };

  useEffect(() => {
    const checkSavedColour = async () => {
      setLoading(true);
      const savedColourList = await api_airtableColour.index();
      setIsSavedColour(
        savedColourList.some(
          (savedColour: AirtableColourListField) =>
            savedColour.colourId === colourId
        )
      );
      setLoading(false);
    };
    checkSavedColour();
  }, []);

  // Loader & Error
  if (loading) {
    return <Loader />;
  } else if (!colourData) {
    return <ErrorPage />;
  }

  return (
    <>
      <img
        src={
          colourData.name.exact_match_name
            ? colourData.image.named
            : colourData.image.bare
        }
        alt=""
      />
      <h2>
        <strong>Name: </strong>

        {colourData.name.exact_match_name ? colourData?.name.value : "Unnamed"}
      </h2>

      {colourData.name.exact_match_name || (
        <div>
          <p>
            Not all colours are named! but you can find the closest named colour
            here:{" "}
          </p>
          <button
            style={{ backgroundColor: colourData.name.closest_named_hex }}
            onClick={() =>
              handleSelectedColourToNavigate(
                colourData.name.closest_named_hex,
                navigate
              )
            }
          >
            See Colour: {colourData.name.closest_named_hex}
          </button>
        </div>
      )}

      {isSavedColour ? (
        <button>Saved</button>
      ) : (
        <button onClick={handleSaveToList}>Save Colour :)</button>
      )}
    </>
  );
};

export default ColourNameCmpnt;
