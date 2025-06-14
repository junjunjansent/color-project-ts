import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

import { type AirtableColourListFieldWithID } from "../../features/colour/colourConstants";
import { RGBifyUrl, stringifyRGB } from "../../features/colour/colourRGBUtils";
import { handleSelectedColourToNavigate } from "../../routes/navigateHandlers";

import styles from "../../styles/colour/colourDiv.module.css";
import { chooseTextColour } from "../../styles/colour/colourStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader";

interface ColourListCardCmpntProp {
  savedColour: AirtableColourListFieldWithID;
  onRemoveFromList: (savedColour: AirtableColourListFieldWithID) => void;
}

const ColourListCardCmpnt = ({
  savedColour,
  onRemoveFromList,
}: ColourListCardCmpntProp) => {
  // define hooks
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    setLoading(true);
    onRemoveFromList(savedColour);
  };

  const cssVariables = useMemo((): Record<`--${string}`, string> => {
    if (!savedColour) {
      return {};
    }
    return {
      "--colour-div-bg": savedColour.hex,
      "--colour-div-text": chooseTextColour(savedColour.hex),
    };
  }, [savedColour]);

  return (
    <>
      <div
        className={styles["colour-div-default"]}
        style={cssVariables}
        draggable="true"
      >
        <div>
          <p>Name: {savedColour.name ?? "-"}</p>
          <p>{savedColour.hex}</p>
          <p>rgb{stringifyRGB(RGBifyUrl(savedColour.colourId))} </p>
        </div>
        <div className={styles["div-btns"]}>
          <button
            onClick={() =>
              handleSelectedColourToNavigate(savedColour.hex, navigate)
            }
          >
            View <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          {loading ? (
            <Loader />
          ) : (
            <button onClick={handleDelete}>
              Delete <FontAwesomeIcon icon={faTrashCan} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ColourListCardCmpnt;
