import { NavLink } from "react-router";
import { PATHS } from "../routes/paths";
import styles from "../styles/navBar.module.css";

const NavBar = () => {
  return (
    <>
      <nav className={styles["navbar"]}>
        <ul className={styles["nav-list"]}>
          <li className={styles["nav-item"]}>
            <NavLink to={PATHS.HOME}>Home Page</NavLink>
          </li>
          <li className={styles["nav-item"]}>
            <NavLink to={PATHS.GAME.COLOUR.START}>🎨 Colour Match</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
