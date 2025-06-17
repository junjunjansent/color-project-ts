// import styles from "../styles/commandBar.module.css"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTrashCan,
//   faMagnifyingGlass,
// } from "@fortawesome/free-solid-svg-icons";

interface CommandBarProp {
  showCommandBar: boolean;
  controlInfo: {
    controlText: string;
    returnToStart: () => void; //change mode
  };
}

const CommandBar = ({ showCommandBar = true }: CommandBarProp) => {
  return (
    <>
      {showCommandBar && (
        <section className="command-section">
          <div className="control"></div>
          <div className="stats"></div>
          <div className="timer"></div>

          {/* <div className="control">
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
              Current Level: {progress?.currentLevel}{" "}
              {matchMode === "levelled" && <>out of 6</>}
            </h4>
            <h4 className="stats-progress">
              Current Round: {progress?.currentRound} out of{" "}
              {progress?.currentLevelDetails.maxRounds}
            </h4>
            <h4 className="stats-progress">
              Chosen Base: "{base?.baseName}", {base?.baseType}
            </h4>
            <h4 className="stats-progress">Current Clicks: {currentTotal}</h4>
            {hintsFeatureIsOn && <h4>Desired No. of Clicks: {correctTotal}</h4>}
            <h4 className="stats-flagged">
              {`You should be able to obtain the results by less than: ${maxClicks}`}
            </h4> */}
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
          {/* {colourGameViewState.showColourSelectors && (
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
            <h5 className="stats-time">Timer: 00:00</h5>            <FontAwesomeIcon icon={faClock} />
          </div> */}
        </section>
      )}
    </>
  );
};

export default CommandBar;
