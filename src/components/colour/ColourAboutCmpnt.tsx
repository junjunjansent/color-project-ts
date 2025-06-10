import debug from "debug";
const log = debug("colours:Component:ColourNameCompt");

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { PATHS } from "../../routes/paths";

import styles from "../../styles/colour/colourProfileAbout.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import { handleSelectedColourToNavigate } from "../../routes/navigateHandlers";
import { type ColourData } from "../../features/colour/colourConstants";
import { type AirtableColourListFieldWithID } from "../../features/colour/colourConstants";
import * as api_airtableColour from "../../features/colour/services/api_airtableColour";
import Loader from "../Loader";
import ErrorPage from "../ErrorPage";

interface ColourAboutCmpntProp {
  colourId: string;
  colourData: ColourData | undefined;
}

const ColourAboutCmpnt = ({ colourId, colourData }: ColourAboutCmpntProp) => {
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
      <div className={styles["about"]}>
        {/* about-left */}
        <div>
          <h2>
            <strong>Name: </strong>

            {colourData.name.exact_match_name
              ? colourData?.name.value
              : "Unnamed"}
          </h2>
          {colourData.name.exact_match_name ? (
            <p>
              This colour's name was derived from database given by{" "}
              <a href="https://thecolorapi.com">thecolourapi.com</a>. There are
              only thousands of named colours out of the 16 million available
              colours to select from! :)
            </p>
          ) : (
            <>
              <p>
                Not all colours are named! At least not from the database used
                in <a href="https://thecolorapi.com">thecolourapi.com</a>, but
                you can find the closest named colour via the button below:{" "}
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
            </>
          )}
        </div>

        <div className={styles["about-middle"]}>
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
                Saved already <FontAwesomeIcon icon={faBookmark} /> <br /> See
                the saved list here!
              </button>
            </Link>
          ) : (
            <button onClick={handleSaveToList}>
              Save Colour <FontAwesomeIcon icon={faFloppyDisk} />
            </button>
          )}
        </div>

        {/* about-right */}
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
      </div>
    </>
  );
};

export default ColourAboutCmpnt;
