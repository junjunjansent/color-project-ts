// import debug from "debug";
// const log = debug("colours:ColourList");

import { useEffect, useState } from "react";

import styles from "../styles/colourListPage.module.css";
import Loader from "../../../../components/Loader";

import * as api_airtableColour from "../../../../features/colour/api_airtableColour";
import { type AirtableColourListFieldWithID } from "../../../../constants/colour/colourConstants";
import ColourListCardCmpnt from "./ColourListCardCmpnt";

const ColourList = () => {
  // declare hooks
  const [savedColourList, setSavedColourList] =
    useState<AirtableColourListFieldWithID[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const onRemoveFromList = async (
    savedColour: AirtableColourListFieldWithID
  ) => {
    //TODO: explore react-toastify
    // show a notification

    // Very certain savedColour will have an id upon being call
    const id = savedColour.id;
    await api_airtableColour.destroy(id);
    const updatedList = savedColourList!.filter(
      (savedColourItem) => savedColourItem.id !== id
    );
    setSavedColourList(updatedList);
  };

  useEffect(() => {
    const fetchSavedColourList = async () => {
      // using try/catch block to setColourData properly
      try {
        setLoading(true);
        const fetchedColourList = await api_airtableColour.index();
        setSavedColourList(fetchedColourList);
      } catch (error) {
        console.error("Failed to load Airtable colour list:", error);
        setSavedColourList(undefined);
      } finally {
        setLoading(false);
      }
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
      <h2>Total Number of Saved Colours: {savedColourList?.length}</h2>
      {/* TODO: Scroll Pagination */}
      <section className={styles["list-saved-colours"]}>
        {savedColourList?.map((savedColour) => {
          return (
            <ColourListCardCmpnt
              key={savedColour.colourId}
              savedColour={savedColour}
              onRemoveFromList={onRemoveFromList}
            />
          );
        })}
      </section>

      {/* <pre>{JSON.stringify(savedColourList, null, 2)}</pre> */}
    </>
  );
};

export default ColourList;
