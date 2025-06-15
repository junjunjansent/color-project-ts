import { Routes, Route, Outlet } from "react-router";
import HomePage from "../pages/HomePage";
import ErrorPage from "../components/ErrorPage";
import ColourStartPage from "../pages/games/colour/ColourStartPage";
import ColourProfile from "../pages/games/colour/mode_analysis/ColourProfilePage";
import ColourList from "../pages/games/colour/mode_analysis/ColourListPage";
import ColourMatchLevelled from "../pages/games/colour/mode_match/ColourMatchLevelledPage";
import ColourMatchRandom from "../pages/games/colour/mode_match/ColourMatchRandomPage";
import GameLayout from "../pages/games/GameLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/game" element={<GameLayout />}>
        <Route path="colour" element={<Outlet />}>
          <Route index element={<ColourStartPage />} />
          <Route path=":colourId" element={<ColourProfile />} />
          <Route path="list" element={<ColourList />} />
          <Route path="matchRandom" element={<ColourMatchRandom />} />
          <Route path="matchLevelled" element={<ColourMatchLevelled />} />
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AppRoutes;
