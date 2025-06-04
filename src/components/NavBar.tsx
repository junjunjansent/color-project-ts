import { NavLink } from "react-router";
import { PATHS } from "../routes/paths";

const NavBar = () => {
  return (
    <>
      <NavLink to={PATHS.HOME}>Home Page</NavLink>
      <NavLink to={PATHS.GAME.COLOUR.START}>🎨 Colour Match</NavLink>
    </>
  );
};

export default NavBar;
