// Command Bar
import { Link } from "react-router";
import { PATHS } from "../../../routes/paths";

// import styles from "../../styles/commandBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

// import ColourCommandBar from "../../../components/colour/ColourCommandBar";
//--------
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

//--------
import debug from "debug";
const log = debug("colours:ColourMatchRandom:");

import { useReducer, useEffect, useMemo } from "react";

import {
  colourGameReducer,
  initialColourGameState,
  type ColourGameViewState,
  getViewStateFromGameStatus,
} from "../../../features/colour/game/colourGameReducer";
import { getRGBBaseKeys } from "../../../features/colour/game/colourMatchStateUtils";
import { colourMatchBases } from "../../../features/colour/game/colourMatchConstants";

import {
  checkColourWinCondition,
  rgbMixFromColourProportions,
} from "../../../features/colour/game/colourMatchGameUtils";
import {
  convertRGBtoHEX,
  stringifyRGB,
} from "../../../features/colour/colourRGBUtils";

import "../../../styles/game.module.css";
import { chooseTextColour } from "../../../styles/colour/colourStyles";
import ConfettiCmpnt from "../../../components/ConfettiCmpnt";

const ColourMatchRandom = () => {
  // define Hooks
  const [colourGameModelState, dispatch] = useReducer(
    colourGameReducer,
    initialColourGameState
  );

  useEffect(() => {
    dispatch({ type: "PENDING_RANDOM_PLAY" });
  }, []);

  // ----------- expensive calculations
  // deconstruct
  const {
    gameStatus,
    base,
    correctColourProportion,
    currentColourProportion,
    hintsModeIsOn,
  } = colourGameModelState;

  // name of base colours
  const extractedBaseDetails = useMemo(() => {
    if (base) {
      return getRGBBaseKeys(base).map((rgbBase) => ({
        label: base[rgbBase].label,
        rgbBase: rgbBase,
        rgb: base[rgbBase].rgb,
        hex: convertRGBtoHEX(base[rgbBase].rgb),
      }));
    }
  }, [base]);

  const [currentTotal, currentRGB, currentHEX] = useMemo(() => {
    if (currentColourProportion && base) {
      const { totalProportions, rgb } = rgbMixFromColourProportions(
        currentColourProportion,
        base
      );
      return [totalProportions, stringifyRGB(rgb), convertRGBtoHEX(rgb)];
    }
    return [0, "", "#000000"];
  }, [currentColourProportion]);

  const [correctTotal, correctRGB, correctHEX] = useMemo(() => {
    if (correctColourProportion && base) {
      const { totalProportions, rgb } = rgbMixFromColourProportions(
        correctColourProportion,
        base
      );
      return [totalProportions, stringifyRGB(rgb), convertRGBtoHEX(rgb)];
    }
    return [0, , "", "#000000"];
  }, [correctColourProportion]);

  // log(currentHEX, correctHEX);
  // log(extractedBaseDetails);

  // --------- handlers
  const handleResetBaseColours = (): void => {
    dispatch({ type: "PENDING_RANDOM_PLAY" });
  };

  const handleBaseSelector = (baseName: string): void => {
    dispatch({
      type: "INITIALISE_PLAY",
      payload: { newBaseName: baseName },
    });
  };

  const handleSubmitColour = () => {
    const winPercentage = checkColourWinCondition(currentHEX, correctHEX);

    if (winPercentage === 100) {
      dispatch({ type: "FINISH_GAME_WITH_WIN" });
    } else {
      dispatch({ type: "FINISH_GAME_WITH_LOSE" });
    }
  };

  const handleResetColour = () => {
    dispatch({ type: "RESET_CURRENT_PROPORTION" });
  };

  const handleCheckboxHintMode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "SET_VIEW_HINTS",
      payload: { hintsChecked: event.target.checked },
    });
  };

  const handleCloseIntro = () => {
    dispatch({ type: "ONGOING_PLAY" });
  };

  const handleMinusColour = (rgbBaseName: `rgbBase${string}`) => {
    dispatch({
      type: "CHANGE_COLOUR_PROPORTION",
      payload: { rgbBaseName: rgbBaseName, changeType: "minus" },
    });
  };

  const handlePlusColour = (rgbBaseName: `rgbBase${string}`) => {
    dispatch({
      type: "CHANGE_COLOUR_PROPORTION",
      payload: { rgbBaseName: rgbBaseName, changeType: "plus" },
    });
  };

  // ---------- Handler for Pop Up
  const handleClose = () => {};

  // ----------- cleanup every render
  const colourGameViewState: ColourGameViewState =
    getViewStateFromGameStatus(gameStatus);
  log(colourGameModelState);
  // log(colourGameViewState);

  return (
    <>
      <h1>Colour Match: Random</h1>

      {colourGameViewState.showBaseSelector && (
        <section id="difficulty-section">
          <h2>
            Begin by choosing your set of Base Colours to Mix: (Recommended
            RGBW)
          </h2>
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
            <h4 className="stats-progress">
              Chosen Base: "{base?.baseName}", {base?.baseType}
            </h4>
            <h4 className="stats-progress">Current Clicks: {currentTotal}</h4>
            {hintsModeIsOn && <h4>Desired No. of Clicks: {correctTotal}</h4>}
            <h4 className="stats-flagged">
              You should be able to obtain the results by less than:
            </h4>
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
            {colourGameViewState.showColourSelectors && (
              <>
                <div>
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    onChange={handleCheckboxHintMode}
                  />
                  <label>Hint</label>
                </div>
                <button onClick={handleResetColour}>Reset Clicks</button>
                <button onClick={handleSubmitColour}>Submit Answer</button>
              </>
            )}
          </div>
          <div className="timer">
            {/* <h5 className="stats-time">Timer: 00:00</h5> */}
            {/* <FontAwesomeIcon icon={faClock} /> */}
          </div>
        </section>
      )}
      {/* <ColourCommandBar /> */}

      <Dialog
        open={colourGameViewState.showIntro}
        onClose={handleClose}
        aria-labelledby="winPopUp"
      >
        <DialogTitle>
          <h4>
            You selected: "<u>{base?.baseName}</u>"
          </h4>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <h6>
              Note that this typically is a colour model that uses the{" "}
              <u>{base?.baseType}</u> mix type:
            </h6>
            <ul>
              <li>
                Additive [Recommended] mixing adds light from different
                wavelengths to create colours. (e.g. TVs, computer screens)
              </li>
              <li>
                Subtractive mixing usually refer to mixing of physical materials
                and how they absorb light and reflect others, resulting in
                different color. (e.g. paint, ink)
                <ul>
                  <li>
                    Pigments absorb and scatter light differently depending on
                    their chemical composition. It is complex to approximate how
                    light interacts with paint layers and the linear models used
                    here would not be realistic enough. One would need spectral
                    reflectance curves and tuning for each pigment.
                  </li>
                </ul>
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseIntro}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {colourGameViewState.showColourLabels && (
        <section>
          <main>
            <div
              style={{
                backgroundColor: currentHEX,
                color: chooseTextColour(currentHEX),
              }}
            >
              {" "}
              <h5>Your Colour</h5>
              {hintsModeIsOn && (
                <small>
                  RGB Colour: {currentRGB} HEX Colour: {currentHEX}
                </small>
              )}
            </div>
            <div
              style={{
                backgroundColor: correctHEX,
                color: chooseTextColour(correctHEX),
              }}
            >
              <h5>Desired Colour</h5>
              {hintsModeIsOn && (
                <small>
                  RGB Colour: {correctRGB} HEX Colour: {correctHEX}
                </small>
              )}
            </div>
          </main>
          <br />

          {extractedBaseDetails?.map((detail) => {
            return (
              <div
                key={detail.rgbBase}
                style={{
                  backgroundColor: detail.hex,
                  color: chooseTextColour(detail.hex),
                }}
              >
                <h6>
                  {detail.label} -{" "}
                  {currentColourProportion
                    ? currentColourProportion[detail.rgbBase]
                    : ""}
                </h6>
                {hintsModeIsOn && (
                  <>
                    RGB Colour: {stringifyRGB(detail.rgb)} HEX Colour:{" "}
                    {detail.hex}
                  </>
                )}
                {colourGameViewState.showColourSelectors && (
                  <>
                    <button onClick={() => handleMinusColour(detail.rgbBase)}>
                      -
                    </button>
                    <button onClick={() => handlePlusColour(detail.rgbBase)}>
                      +
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </section>
      )}

      <Dialog
        open={colourGameViewState.showWinPopup}
        onClose={handleClose}
        aria-labelledby="winPopUp"
      >
        <ConfettiCmpnt />
        <DialogTitle>
          <h4>🤩!!You WON!!🤩</h4>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You achieved a 100% accuracy! Congratulations! :)
            <main>
              <div
                style={{
                  backgroundColor: currentHEX,
                  color: chooseTextColour(currentHEX),
                }}
              >
                {" "}
                <h5>You obtained this Colour:</h5>
                <small>
                  RGB Colour: {currentRGB} HEX Colour: {currentHEX}
                </small>
              </div>
              <div
                style={{
                  backgroundColor: correctHEX,
                  color: chooseTextColour(correctHEX),
                }}
              >
                <h5>This was the Desired Colour:</h5>
                <small>
                  RGB Colour: {correctRGB} HEX Colour: {correctHEX}
                </small>
              </div>
            </main>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleResetBaseColours}>
            Restart Game
          </Button>
          <Button onClick={handleResetBaseColours}>Restart Game</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={colourGameViewState.showLosePopup}
        onClose={handleClose}
        aria-labelledby="winPopUp"
      >
        <DialogTitle>
          <h4>You Lost! 😔</h4>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You achieved a {checkColourWinCondition(currentHEX, correctHEX)}%
            accuracy... close.. <small>I guess...</small>
            <main>
              <div
                style={{
                  backgroundColor: currentHEX,
                  color: chooseTextColour(currentHEX),
                }}
              >
                {" "}
                <h5>You obtained this Colour:</h5>
                <small>
                  RGB Colour: {currentRGB} HEX Colour: {currentHEX}
                </small>
                <button></button>
              </div>
              <div
                style={{
                  backgroundColor: correctHEX,
                  color: chooseTextColour(correctHEX),
                }}
              >
                <h5>This was the Desired Colour:</h5>
                <small>
                  RGB Colour: {correctRGB} HEX Colour: {correctHEX}
                </small>
                <button></button>
              </div>
            </main>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleResetBaseColours}>
            Restart Game
          </Button>
          <Button onClick={handleResetBaseColours}>Restart Game</Button>
        </DialogActions>
      </Dialog>

      {/* 
  showWinPopup: boolean;
  showLosePopup: boolean; */}

      <pre>{JSON.stringify(colourGameModelState, null, 2)}</pre>
      <pre>{JSON.stringify(colourGameViewState, null, 2)}</pre>
    </>
  );
};

export default ColourMatchRandom;
