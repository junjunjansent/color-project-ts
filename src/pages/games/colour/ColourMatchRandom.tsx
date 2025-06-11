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

import { useReducer, useEffect, useMemo } from "react";

import {
  colourGameReducer,
  initialColourGameState,
  type ColourGameViewState,
  getViewStateFromGameStatus,
} from "../../../features/colour/match/colourGameReducer";
import {
  colourMatchBases,
  // type ColourMatchBase,
} from "../../../features/colour/match/colourMatchConstants";

import "../../../styles/game.module.css";
import { rgbMixFromColourProportions } from "../../../features/colour/match/colourMatchUtils";
import { convertRGBtoHEX } from "../../../features/colour/colourRGBUtils";

const ColourMatchRandom = () => {
  // define Hooks
  const [colourGameModelState, dispatch] = useReducer(
    colourGameReducer,
    initialColourGameState
  );

  // deconstruct
  const { gameStatus, base, correctColourProportion } = colourGameModelState;

  useEffect(() => {
    dispatch({ type: "PENDING_RANDOM_PLAY" });
  }, []);

  // --------- handlers
  const handleResetBaseColours = (): void => {
    dispatch({ type: "PENDING_RANDOM_PLAY" });
  };

  const handleBaseSelector = (baseName: string): void => {
    dispatch({
      type: "INITIALISE_PLAY",
      payload: { newBaseName: baseName },
    });
    // log(colourGameModelState.correctColourProportion);
    // log(colourGameModelState.base);
    // log(
    //   rgbMixFromColourProportions(
    //     colourGameModelState.correctColourProportion,
    //     colourGameModelState.base
    //   )
    // );
  };

  // ----------- expensive calculations
  const correctHEX = useMemo(() => {
    if (!correctColourProportion || !base) {
      throw new Error("No Correct Colour Propoirtion or Base");
    }
    const rgbMix = rgbMixFromColourProportions(correctColourProportion, base);
    return convertRGBtoHEX(rgbMix);
  }, [correctColourProportion]);

  log(correctHEX);

  // ----------- cleanup every render
  const colourGameViewState: ColourGameViewState =
    getViewStateFromGameStatus(gameStatus);
  log(colourGameModelState);
  // log(colourGameViewState);

  return (
    <>
      <h1>Colour Match Random</h1>

      {colourGameViewState.showBaseSelector && (
        <section id="difficulty-section">
          <h2>Begin by choosing your set of Base Colours to Mix:</h2>
          {Object.keys(colourMatchBases).map((baseName) => (
            <button key={baseName} onClick={() => handleBaseSelector(baseName)}>
              {baseName} <br />
              <small>Mix Type: {colourMatchBases[baseName].baseType}</small>
            </button>
          ))}
          {/* <!-- <button class="btn-difficulty" data-label="baby">
          👶<br />
          <p>5x5 grid (3 bombs)</p>
          Baby
        </button> --> */}
        </section>
      )}

      {colourGameViewState.showCommandBar && (
        <section className="command-section">
          <div className="control">
            <h2 id="message"></h2>
            <Link to={PATHS.GAME.COLOUR.START}>
              <button>Return to Start Page</button>
            </Link>
            <button onClick={handleResetBaseColours}>
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
      )}
      {/* <ColourCommandBar /> */}

      {colourGameViewState.showColourSelectors && <section></section>}

      {/* showColourSelectors: boolean;
  showColourProportions: boolean;
  showAnswer: boolean;
  showWinPopup: boolean;
  showLosePopup: boolean; */}

      <pre>{JSON.stringify(colourGameModelState, null, 2)}</pre>
      <pre>{JSON.stringify(colourGameViewState, null, 2)}</pre>
    </>
  );
};

export default ColourMatchRandom;
