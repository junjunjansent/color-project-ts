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
  ColourMatchBaseCore,
  // type ColourMatchBase,
} from "../../../features/colour/match/colourMatchConstants";

import "../../../styles/game.module.css";

const ColourMatchRandom = () => {
  // define Hooks
  const [colourGameModelState, dispatch] = useReducer(
    colourGameReducer,
    initialColourGameState
  );

  // initialise playStyle
  const initialisePlay = () => {
    dispatch({
      type: "SET_GAME_STATUS",
      payload: { newGameStatus: "pendingMode" },
    });
    dispatch({
      type: "SET_PLAYSTYLE",
      payload: { newPlayStyle: "Random" },
    });
  };

  useEffect(() => {
    initialisePlay();
  }, []);

  // --------- handlers
  const handleBaseSelector = (baseName: string) => {
    log(baseName);
    // if (baseName in ColourMatchBase)
    // //   dispatch({
    // //     type: "SET_BASE",
    // //     payload: { newBase: baseName },
    // //   });
    // // dispatch({
    // //   type: "SET_BASE",
    // //   payload: { newBase: baseName },
    // // });
  };

  const colourGameViewState: ColourGameViewState = getViewStateFromGameStatus(
    colourGameModelState.status
  );
  log(colourGameModelState);

  return (
    <>
      <h1>Colour Match Random</h1>

      <section className="command-section">
        <div className="control">
          <h2 id="message"></h2>
          <Link to={PATHS.GAME.COLOUR.START}>
            <button>Return to Start Page</button>
          </Link>
          <button>
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
          {Object.keys(ColourMatchBaseCore).map((baseName) => (
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
    </>
  );
};

export default ColourMatchRandom;
