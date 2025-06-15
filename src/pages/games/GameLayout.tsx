import { Suspense } from "react";
import { Outlet } from "react-router";
import "../../styles/game.module.css";
import Loader from "../../components/Loader";

const GameLayout = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default GameLayout;
