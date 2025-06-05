const BASE_COLOUR_URL = "https://www.thecolorapi.com/";

const show = (rgb: string) => {
  //rgb must be in the format "(xx,xx,xx)"

  const schemeColourCount = 6;
  const url = `${BASE_COLOUR_URL}scheme?rgb=${rgb}&format=json&count=${schemeColourCount}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => {
      console.log(error);
      return null;
    });
};

export { show };
