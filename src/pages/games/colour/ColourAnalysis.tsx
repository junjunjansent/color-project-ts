import debug from "debug";
const log = debug("colours:ColourAnalysis");

import { useParams } from "react-router";
import { useEffect } from "react";
import { RGBifyUrl, stringifyRGB } from "../../../features/colour/colourData";

const ColourAnalysis = () => {
  const { id } = useParams();
  const rgb = RGBifyUrl(id as string); //TODO type guard
  log(rgb);

  useEffect(() => {
    // const fetchColourDetails = async () => {
    //   const pet = await show(petId);
    //   setPet(pet);
    // };
    // fetchPet();
  });

  return (
    <>
      <h1>ColourAnalysis</h1>
      <h2>{stringifyRGB(rgb)}</h2>
      <h2>howdy</h2>
    </>
  );
};

export default ColourAnalysis;
