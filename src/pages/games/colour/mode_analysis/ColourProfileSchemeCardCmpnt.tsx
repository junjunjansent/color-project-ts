import { useNavigate } from "react-router";
import { handleSelectedColourToNavigate } from "../../../../routes/navigateHandlers";

import { type ColourSchemeAPI } from "../../../../constants/colour/colourConstants";
import { colourSchemeList } from "../../../../constants/colour/colourConstants";

import { chooseTextColour } from "../styles/colourStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface ColourSchemeCardCmpntProp {
  scheme: ColourSchemeAPI;
  selected: boolean;
  handleSelectedColourScheme: (scheme: ColourSchemeAPI) => void;
}

const ColourProfileSchemeCardCmpnt = ({
  scheme,
  selected,
  handleSelectedColourScheme,
}: ColourSchemeCardCmpntProp) => {
  // define hooks
  const navigate = useNavigate();

  return (
    <>
      <h5>{colourSchemeList[scheme.mode]}</h5>
      <button onClick={() => handleSelectedColourScheme(scheme)}>
        {selected ? (
          <>
            Selected <FontAwesomeIcon icon={faCheck} />
          </>
        ) : (
          <>
            See Colour Scheme <FontAwesomeIcon icon={faMagnifyingGlass} />
          </>
        )}
      </button>
      <div>
        {scheme.colors.map((color) => {
          return (
            <button
              key={color.hex.value}
              style={{
                backgroundColor: color.hex.value,
                color: chooseTextColour(color.hex.value),
                fontSize: "0.6rem",
                padding: "0.5rem",
              }}
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
      </div>
    </>
  );
};

export default ColourProfileSchemeCardCmpnt;
