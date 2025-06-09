import { useMemo } from "react";
import { useNavigate } from "react-router";

import { type AirtableColourListFieldWithID } from "../../features/colour/colourConstants";
import {
  RGBifyUrl,
  stringifyRGB,
} from "../../features/colour/colourRGBHandler";
import { handleSelectedColourToNavigate } from "../../routes/navigateHandlers";

import styles from "../../styles/colour/colourDiv.module.css";
import { chooseTextColour } from "../../styles/colour/colourStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

interface ColourListCardCmpntProp {
  savedColour: AirtableColourListFieldWithID;
  handleRemoveFromList: (savedColour: AirtableColourListFieldWithID) => void;
}

const ColourListCardCmpnt = ({
  savedColour,
  handleRemoveFromList,
}: ColourListCardCmpntProp) => {
  // define hooks
  const navigate = useNavigate();

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
    <div className={styles["colour-div-default"]} style={cssVariables}>
      <div>
        <p>rgb{stringifyRGB(RGBifyUrl(savedColour.colourId))} </p>
        <p>{savedColour.hex}</p>
        <p>{savedColour.name ?? ""}</p>
      </div>
      <div className={styles["div-btns"]}>
        <button
          onClick={() =>
            handleSelectedColourToNavigate(savedColour.hex, navigate)
          }
        >
          View <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button onClick={() => handleRemoveFromList(savedColour)}>
          Delete <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
};

export default ColourListCardCmpnt;
