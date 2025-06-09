import debug from "debug";
const log = debug("colours:Component:ColourNameCompt");

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { PATHS } from "../../routes/paths";

import styles from "../../styles/colour/colourAnalysis.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import { handleSelectedColourToNavigate } from "../../routes/navigateHandlers";
import { type ColourData } from "../../features/colour/colourConstants";
import { type AirtableColourListFieldWithID } from "../../features/colour/colourConstants";
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
          (savedColour: AirtableColourListFieldWithID) =>
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
      {colourData.name.exact_match_name || (
        <div>
          <h2>
            <strong>Name: </strong>

            {colourData.name.exact_match_name
              ? colourData?.name.value
              : "Unnamed"}
          </h2>
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

      <div className={styles["name-and-specs-middle"]}>
        <h4>Colour Image</h4>
        <img
          src={
            colourData.name.exact_match_name
              ? colourData.image.named
              : colourData.image.bare
          }
          alt=""
        />
        {isSavedColour ? (
          <Link to={PATHS.GAME.COLOUR.LIST}>
            {" "}
            <button>
              Saved already <FontAwesomeIcon icon={faBookmark} /> <br /> See the
              saved list here!
            </button>
          </Link>
        ) : (
          <button onClick={handleSaveToList}>
            Save Colour <FontAwesomeIcon icon={faFloppyDisk} />
          </button>
        )}
      </div>
    </>
  );
};

export default ColourNameCmpnt;
