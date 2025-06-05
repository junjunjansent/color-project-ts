import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import ErrorPage from "../components/ErrorPage";
import ColourStartPage from "../pages/games/colour/ColourStartPage";
import ColourAnalysis from "../pages/games/colour/ColourAnalysis";
import ColourList from "../pages/games/colour/ColourList";
import ColourMatchLevelled from "../pages/games/colour/ColourMatchLevelled";
import ColourMatchRandom from "../pages/games/colour/ColourMatchRandom";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Game Routes: cause all are new pages */}
        <Route path="/game/colour" element={<ColourStartPage />} />
        <Route path="/game/colour/:id" element={<ColourAnalysis />} />
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
