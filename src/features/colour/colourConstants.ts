// ----------- Constants
// const colourSchemeList2 = [
//   { name: "monochrome", label: "Monochrome" },
//   { name: "monochrome-dark", label: "Monochrome Dark" },
//   { name: "monochrome-light", label: "Monochrome Light" },
//   { name: "analogic", label: "Analogic" },
//   { name: "complement", label: "Complement" },
//   { name: "analogic-complement", label: "Analogic Complement" },
//   { name: "triad", label: "Triad" },
//   { name: "quad", label: "Quad" },
// ] as const;

const colourSchemeList = {
  monochrome: "Monochrome",
  "monochrome-dark": "Monochrome Dark",
  "monochrome-light": "Monochrome Light",
  analogic: "Analogic",
  complement: "Complement",
  "analogic-complement": "Analogic Complement",
  triad: "Triad",
  quad: "Quad",
} as const;

const RGBUrlRegex = /^\d{1,3}-\d{1,3}-\d{1,3}$/;

// ----------- Types

type RGB = { R: number; G: number; B: number };

// [number] tells me that this is the type of any item in the array, i.e. union of all of them
type ColourSchemeList = typeof colourSchemeList;

// ----------- Colour Emotions Type
type ColourEmotionsData = ColourEmotionsVariationData & {
  mainColour: ColourEmotionsMainData;
};

interface ColourEmotionsVariationData {
  name: string;
  rgb: RGB;
  hex: string;
  description: string[];
  isMainColour: boolean;
  belongsTo: string;
}

interface ColourEmotionsMainData {
  name: string;
  rgb: RGB;
  traits: { positive: string[]; negative: string[] };
  represents: { label: string; description: string }[];
  effects: { label: string; description: string }[];
}

// TODO - Constants API zod?
// ----------- API Colour Types
type ColourData = ColourAPI & { schemes: ColourSchemeAPI[] };
interface ColourAPI {
  hex: {
    value: string;
  };
  rgb: {
    r: number;
    g: number;
    b: number;
    value: string;
  };
  hsl: {
    h: number;
    s: number;
    l: number;
    value: string;
  };
  hsv: {
    h: number;
    s: number;
    v: number;
    value: string;
  };
  name: {
    value: string;
    closest_named_hex: string;
    exact_match_name: boolean;
    distance: number;
  };
  cmyk: {
    c: number | null;
    m: number | null;
    y: number | null;
    k: number | null;
    value: string;
  };
  XYZ: {
    X: number;
    Y: number;
    Z: number;
    value: string;
  };
  image: {
    bare: string;
    named: string;
  };
  contrast: {
    value: string;
  };
  [key: string]: unknown;
}

interface ColourSchemeAPI {
  mode: keyof typeof colourSchemeList; // very certain its one of these modes
  count: number;
  colors: ColourAPI[];
  seed: ColourAPI;
  image: {
    bare: string;
    named: string;
  };
  [key: string]: unknown;
}

// ----------- Airtable API Types
interface AirtableColourListField {
  colourId: string;
  hex: string;
  name?: string;
  id?: string;
}

interface AirtableColourListRecord {
  id: string;
  createdTime: string;
  fields: AirtableColourListField;
}

export {
  colourSchemeList,
  RGBUrlRegex,
  type RGB,
  type ColourSchemeList,
  type ColourEmotionsData,
  type ColourEmotionsVariationData,
  type ColourEmotionsMainData,
  type ColourData,
  type ColourSchemeAPI,
  type AirtableColourListField,
  type AirtableColourListRecord,
};
