import { Outlet, Link, useNavigate } from "react-router";
import { PATHS } from "../../../routes/paths";

import {
  randomiseRGB,
  urlifyRGB,
  convertHEXtoRGB,
} from "../../../features/colour/colourData";

import debug from "debug";
const log = debug("colours:pages/game/colour/ColourStartPage");

// - [ ] As a user, I will see a Colour Game Start Page, with information on colour theory and brief information on the fe`atures available
// - Basic intro on Colour Theory
// - Potentially via Pop up boxes:
//   - Colour & how their meaning is derived
//   - Importance of Colour Schemes
// - [ ] As a user, I will be able to to choose between two options on the start page
// - Choosing Colour Analysis
//   - Colour of choice via input
//   - Random generated colour
// - Playing Colour Game
//   - Random Colour
//   - Levelled one (future)

const ColourStartPage = () => {
  const navigate = useNavigate();

  const handleInputColourAnalysis = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    // get form Data
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    console.log(data.colourToAnalyse);
    const rgb = convertHEXtoRGB(data.colourToAnalyse as string); //TODO type guard
    const rgbUrl = urlifyRGB(rgb);
    navigate(PATHS.GAME.COLOUR.COLOUR_ID(rgbUrl));
  };

  const handleRandomiseColourAnalysis = () => {
    log("randomising");
    const rgb = randomiseRGB();
    const rgbUrl = urlifyRGB(rgb);
    navigate(PATHS.GAME.COLOUR.COLOUR_ID(rgbUrl));
  };

  return (
    <>
      <h1>Colour Game</h1>
      <h3>Background</h3>
      <p>
        I chose this little project because I found it fascinating that
        theoretically, all colours on the colour wheel can be generated with the
        base primary colours. In order to test my CSS and advance my knowledge
        on colour theory, I built this lil game :) Note the emotions were
        derived from{" "}
        <a href="https://www.empower-yourself-with-color-psychology.com/meaning-of-colors.html">
          this website
        </a>
        .
      </p>

      <h3>Just a lil Colour Theory 🎨</h3>
      <p>
        You already know, colour is... <strong>EVERYWHERE</strong>! — in nature,
        art, design, and everyday objects.
        <br />
        It shapes how we feel and how we communicate without words. In that
        sense, it is another language and avenue for us to better connect with
        each other and express ourselves. <br />
      </p>
      <div className="colorInfo">
        <h6>Categorising Colour 📁</h6>
        <p>
          Colours are described by their hue (the colour itself), saturation
          (intensity), and value (lightness or darkness). They are also grouped
          as warm (reds, oranges) or cool (blues, greens), helping us understand
          and use them better. Some methods include their colour proportions
          (e.g. RGB, RYB, CMY), HSV (Hue, Saturation, Value), and Hex
          (hexademical) colour.
        </p>
      </div>
      <div className="colorInfo">
        <h6>Colour & Emotions 😮‍💨</h6>
        <p>
          Our biology, culture, and nature affects how we perceive and 'feel'
          colour. You already know this from the usual 'blue → sky → calm' &
          'red → fire → anger'. Different cultures may assign unique meanings
          too and Designers often use these emotional connections to create the
          right mood and impact. <br />
          Fun Fact: As a culture develops more colour terms, they tend to follow
          the sequence of (i) Black/White, (ii) Red, (iii) Green/Yellow, (iv)
          Blue, (v) Brown, etc. (Berlin and Kay's Theory of Basic Colour Terms,
          1969)
        </p>
      </div>
      <div className="colorInfo">
        <h6>Colour Schemes ⚖️</h6>
        <p>
          Colour schemes arrange colours in ways that look balanced and
          pleasing—like complementary colours that contrast or analogous colours
          that blend smoothly. Good schemes create harmony, making designs feel
          unified and easy on the eyes. Without balance, colours can clash,
          causing confusion or discomfort.
        </p>
      </div>

      <section>
        <h4>Colour Analysis</h4>
        <p>
          Choose a colour to learn about their details, the emotion it may be
          closely linked to, and some of their colour schemes you could try out
          in designs :)
        </p>
        <form onSubmit={handleInputColourAnalysis}>
          <label>
            <input
              type="color"
              name="colourToAnalyse"
              defaultValue="#000000"
              // ={colourHexToAnalyse}
              // onChange={handleColourInput}
            />
          </label>
          <button>Let's go</button>
        </form>
        <button onClick={handleRandomiseColourAnalysis}>Randomise</button>
        <button>
          {/* TODO Explore this feature */}
          Search Emotion (Not Built)
        </button>
      </section>

      <section>
        <h4>Colour Match</h4>
        <p>
          Colours are created by combining a few basic, base colours. By mixing
          your primary colours, you get your secondary and tertiary colours.{" "}
        </p>
        <ul>
          <li>
            In traditional art, the primary colours are Red, Yellow, and Blue
            (RYB). Colours are mixed subtractively.
          </li>
          <li>
            In printers, colours used are Cyan, Magenta, Yellow, and Black
            (CMYK) inks. Colours are mixed subtractively too!
          </li>
          <li>
            In digital screens, colours are created from Red, Green, and Blue
            (RGB) light. These colours mix additively, meaning adding light
            creates white.
          </li>
        </ul>
        <p>
          Notice that additive colour mixing combines light (e.g. digital), so
          adding all gives white. Subtractive mixing combines pigments, which
          absorb light as it bounces off the objects and entering our eyes, so
          mixing (i.e. RYB and CMY) all gives black or dark brown.
        </p>
        <Link to={PATHS.GAME.COLOUR.MATCH_RANDOM}>
          <button>Randomise</button>
        </Link>
        <Link to={PATHS.GAME.COLOUR.MATCH_LEVELLED}>
          <button>Level (Not Built)</button>
        </Link>
        <button>
          {/* TODO Explore this feature */}
          Create Own Colour (Not Built)
        </button>
      </section>
      <Outlet />
    </>
  );
};

export default ColourStartPage;
