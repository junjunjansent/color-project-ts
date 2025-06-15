import { Link } from "react-router";
import { PATHS } from "../../../../routes/paths";

// import styles from "../../styles/commandBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const ColourCommandBar = () => {
  return (
    <>
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
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="flag-state"
              className="toggle-input"
              name="flag-state"
            />
            {/* <label for="flag-state" className="toggle-label">
              <div className="toggle-actuator">
                <span className="toggle-icon"></span>
              </div>
            </label> */}
          </div>
          <h4 className="stats-flagged"></h4>
        </div>
        <div className="timer">
          <h5 className="stats-time">Timer: 00:00</h5>
          <FontAwesomeIcon icon={faClock} />
        </div>
      </section>
    </>
  );
};

export default ColourCommandBar;
