import {
  type AirtableColourListField,
  type AirtableColourListFieldWithID,
  type AirtableColourListRecord,
} from "../../constants/colour/colourConstants";

const BASE_AIRTABLE_COLOUR_URL =
  "https://api.airtable.com/v0/appbkUvuOT2Hs1VEv/Table%201";

const AIRTABLE_HEADER = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
  "Content-Type": "application/json",
};

// ---------- function definitions

const fetchJson = async (
  url: string,
  methodStr: string = "GET",
  bodyData?:
    | { fields: AirtableColourListField }
    | { id: string; deleted: boolean }
) => {
  const res = await fetch(url, {
    method: methodStr,
    body: JSON.stringify(bodyData),
    headers: AIRTABLE_HEADER,
  });
  if (!res.ok) {
    throw new Error(`HTTP Status: ${res.status}`);
  }
  return res.json();
};

const index = async (
  accumulatedRecord: AirtableColourListFieldWithID[] = [],
  offset?: string | undefined
): Promise<AirtableColourListFieldWithID[]> => {
  // to deal with pagination

  const url = `${BASE_AIRTABLE_COLOUR_URL}?view=Grid view${
    offset ? `&offset=${offset}` : ``
  }`;

  try {
    const json = await fetchJson(url, "GET");
    const currentRecord: AirtableColourListFieldWithID[] = json.records.map(
      (record: AirtableColourListRecord) => ({
        ...record.fields,
        id: record.id,
      })
    );

    const newRecord: AirtableColourListFieldWithID[] = [
      ...accumulatedRecord,
      ...currentRecord,
    ];
    if (json.offset) {
      return index(newRecord, json.offset);
    } else {
      return newRecord;
    }
  } catch (error) {
    console.error(error);
    return accumulatedRecord;
  }
};

// const result = await index();
// console.log(result);

const indexCheckSavedColour = async (colourId: string): Promise<boolean> => {
  const url = `${BASE_AIRTABLE_COLOUR_URL}?view=Grid view&filterByFormula={colourId}="${colourId}"`;

  try {
    const json = await fetchJson(url, "GET");

    if (json.records.length >= 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const create = async (data: { fields: AirtableColourListField }) => {
  const url = `${BASE_AIRTABLE_COLOUR_URL}`;

  try {
    const json = await fetchJson(url, "POST", data);
    return json;
  } catch (error) {
    console.error(error);
  }
};

// const result = await create({
//   fields: {
//     colourId: "171-173-72",
//     hex: "#ABAD48",
//     name: "Peridot",
//   },
// });
// console.log(result);

const destroy = async (idStr: string) => {
  const url = `${BASE_AIRTABLE_COLOUR_URL}/${idStr}`;

  try {
    const json = await fetchJson(url, "DELETE", { id: idStr, deleted: true });
    return json;
  } catch (error) {
    console.error(error);
  }
};

// const result = await destroy("recAqs20OP06EDiFN");
// console.log(result);

export { index, indexCheckSavedColour, create, destroy };
