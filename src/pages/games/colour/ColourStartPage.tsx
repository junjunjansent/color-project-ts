import { Outlet, Link } from "react-router";
import { PATHS } from "../../../routes/paths";

const ColourStartPage = () => {
  return (
    <>
      <h1>ColourStartPage</h1>
      <section>
        <h3>Colour Analysis</h3>
        <button>
          <Link to={PATHS.GAME.COLOUR.COLOUR_ID("")}>Input</Link>
        </button>
        <button>
          <Link to={PATHS.GAME.COLOUR.COLOUR_ID("")}>Randomise</Link>
        </button>
      </section>

      <section>
        <h3>Colour Match</h3>
        <button>
          <Link to={PATHS.GAME.COLOUR.MATCH_RANDOM}>Randomise</Link>
        </button>
        <button>
          <Link to={PATHS.GAME.COLOUR.MATCH_LEVELLED}>Level (Not Built)</Link>
        </button>
      </section>
      <Outlet />
    </>
  );
};

export default ColourStartPage;
