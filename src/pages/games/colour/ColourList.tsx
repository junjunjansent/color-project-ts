// import debug from "debug";
// const log = debug("colours:ColourList");

import { useEffect, useState } from "react";
import * as api_airtableColour from "../../../features/colour/api_airtableColour";
import Loader from "../../../components/Loader";
import {
  RGBifyUrl,
  stringifyRGB,
} from "../../../features/colour/colourRGBHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const ColourList = () => {
  // declare sates
  const [savedColourList, setSavedColourList] =
    useState<api_airtableColour.AirtableColourListField[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleRemoveFromList = async (
    savedColour: api_airtableColour.AirtableColourListField
  ) => {
    //TODO: explore react-toastify
    // show a notification

    // Very certain savedColour will have an id upon being call
    const id = savedColour.id!;
    await api_airtableColour.destroy(id);
    const updatedList = savedColourList!.filter(
      (savedColourItem) => savedColourItem.id !== id
    );
    setSavedColourList(updatedList);
  };

  useEffect(() => {
    const fetchSavedColourList = async () => {
      setLoading(true);
      const fetchedColourList = await api_airtableColour.index();
      setSavedColourList(fetchedColourList);
      setLoading(false);
    };

    fetchSavedColourList();
  }, []);

  // Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h1>List of Saved Colours</h1>
      {savedColourList?.map((savedColour) => {
        return (
          <div
            key={savedColour.id!}
            style={{ backgroundColor: savedColour.hex }}
          >
            <div>
              rgb{stringifyRGB(RGBifyUrl(savedColour.colourId))} <br />
              {savedColour.hex} <br />
              {savedColour.name ?? ""}{" "}
            </div>
            <button onClick={() => handleRemoveFromList(savedColour)}>
              Delete <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        );
      })}

      {/* <pre>{JSON.stringify(savedColourList, null, 2)}</pre> */}
    </>
  );
};

export default ColourList;
