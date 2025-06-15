import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import ErrorPage from "../components/ErrorPage";
import ColourStartPage from "../pages/games/colour/ColourStartPage";
import ColourProfile from "../pages/games/colour/mode_analysis/ColourProfilePage";
import ColourList from "../pages/games/colour/mode_analysis/ColourListPage";
import ColourMatchLevelled from "../pages/games/colour/mode_match/ColourMatchLevelledPage";
import ColourMatchRandom from "../pages/games/colour/mode_match/ColourMatchRandomPage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Game Routes: cause all are new pages */}
        <Route path="/game/colour" element={<ColourStartPage />} />
        <Route path="/game/colour/:colourId" element={<ColourProfile />} />
        <Route path="/game/colour/list" element={<ColourList />} />
        <Route
          path="/game/colour/matchRandom"
          element={<ColourMatchRandom />}
        />
        <Route
          path="/game/colour/matchLevelled"
          element={<ColourMatchLevelled />}
        />

        {/* Error Routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
