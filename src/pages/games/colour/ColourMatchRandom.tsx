// Command Bar
import { Link } from "react-router";
import { PATHS } from "../../../routes/paths";

// import styles from "../../styles/commandBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

// import ColourCommandBar from "../../../components/colour/ColourCommandBar";
//--------
import debug from "debug";
const log = debug("colours:ColourMatchRandom:");

import { useReducer, useEffect } from "react";

import {
  colourGameReducer,
  initialColourGameState,
  type ColourGameViewState,
  getViewStateFromGameStatus,
} from "../../../features/colour/match/colourGameReducer";
import {
  colourMatchBases,
  isColourMatchBase,
  // type ColourMatchBase,
} from "../../../features/colour/match/colourMatchConstants";

import "../../../styles/game.module.css";

const ColourMatchRandom = () => {
  // define Hooks
  const [colourGameModelState, dispatch] = useReducer(
    colourGameReducer,
    initialColourGameState
  );

  useEffect(() => {
    dispatch({ type: "PENDING_RANDOM_PLAY" });
  }, []);

  // --------- handlers
  const handleChangeBaseColours = (): void => {
    dispatch({ type: "PENDING_RANDOM_PLAY" });
  };

  const handleBaseSelector = (baseName: string): void => {
    if (isColourMatchBase(baseName)) {
      dispatch({
        type: "INITIALISE_PLAY",
        payload: { newBase: baseName },
      });
    }
  };

  // ----------- cleanup every render
  const colourGameViewState: ColourGameViewState = getViewStateFromGameStatus(
    colourGameModelState.gameStatus
  );
  log(colourGameModelState);
  log(colourGameViewState);

  return (
    <>
      <h1>Colour Match Random</h1>

      <section className="command-section">
        <div className="control">
          <h2 id="message"></h2>
          <Link to={PATHS.GAME.COLOUR.START}>
            <button>Return to Start Page</button>
          </Link>
          <button onClick={handleChangeBaseColours}>
            Change Base Colours <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
        </div>
        <div className="stats">
          <h4 className="stats-progress"></h4>
          {/* <div className="toggle-switch">
            <input
              type="checkbox"
              id="flag-state"
              className="toggle-input"
              name="flag-state"
            />
            <label for="flag-state" className="toggle-label">
              <div className="toggle-actuator">
                <span className="toggle-icon"></span>
              </div>
            </label>
          </div> */}
          <h4 className="stats-flagged"></h4>
        </div>
        <div className="timer">
          {/* <h5 className="stats-time">Timer: 00:00</h5> */}
          {/* <FontAwesomeIcon icon={faClock} /> */}
        </div>
      </section>
      {/* <ColourCommandBar /> */}

      {colourGameViewState.showBaseSelector && (
        <section id="difficulty-section">
          {Object.keys(colourMatchBases).map((baseName) => (
            <button key={baseName} onClick={() => handleBaseSelector(baseName)}>
              {baseName}
            </button>
          ))}
          {/* <!-- <button class="btn-difficulty" data-label="baby">
          👶<br />
          <p>5x5 grid (3 bombs)</p>
          Baby
        </button> --> */}
        </section>
      )}

      <pre>{JSON.stringify(colourGameModelState, null, 2)}</pre>
      <pre>{JSON.stringify(colourGameViewState, null, 2)}</pre>
    </>
  );
};

export default ColourMatchRandom;
