// ----------- Constants
export const colourSchemeList = [
  { name: "monochrome", label: "Monochrome" },
  { name: "monochrome-dark", label: "Monochrome Dark" },
  { name: "monochrome-light", label: "Monochrome Light" },
  { name: "analogic", label: "Analogic" },
  { name: "complement", label: "Complement" },
  { name: "analogic-complement", label: "Analogic Complement" },
  { name: "triad", label: "Triad" },
  { name: "quad", label: "Quad" },
] as const;

export const RGBUrlRegex = /^\d{1,3}-\d{1,3}-\d{1,3}$/;

// ----------- Types

export type RGB = { R: number; G: number; B: number };

// [number] tells me that this is the type of any item in the array, i.e. union of all of them
export type ColourSchemeList = (typeof colourSchemeList)[number];

export type ColourData = ColourAPI & { schemes: ColourSchemeAPI[] };

// TODO - Constants API zod?
// API Calls
type ColourAPI = {
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
};

export type ColourSchemeAPI = {
  mode: string;
  count: number;
  colors: ColourAPI[];
  seed: ColourAPI;
  image: {
    bare: string;
    named: string;
  };
  [key: string]: unknown;
};
