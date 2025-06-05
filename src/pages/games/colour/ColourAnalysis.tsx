import debug from "debug";
const log = debug("colours:ColourAnalysis");

import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { RGBifyUrl, stringifyRGB } from "../../../features/colour/colourData";
import * as api_colour from "../../../features/colour/api_colour";
import ErrorPage from "../../../components/ErrorPage";

const ColourAnalysis = () => {
  // get details of site
  const { id } = useParams();
  if (!id) {
    return <ErrorPage />;
  }
  const rgb = RGBifyUrl(id);

  // define states
  const [colourDetail, setColourDetail] = useState<unknown>();

  useEffect(() => {
    const fetchColourDetails = async () => {
      const newColourDetail = await api_colour.show(rgb);
      setColourDetail(newColourDetail);
    };
    fetchColourDetails();
    log(colourDetail);
  }, []);

  return (
    <>
      <h1>ColourAnalysis</h1>
      <h2>{stringifyRGB(rgb)}</h2>
      <h2>{JSON.stringify(colourDetail)}</h2>
    </>
  );
};

export default ColourAnalysis;
