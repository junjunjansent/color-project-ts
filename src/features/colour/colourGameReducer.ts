// export const GameStatus = {
//     PendingMode: "pendingMode",          --> allow choosing base colours
//     InitialisePlay: "initialisePlay",    --> final colour shown
//     Ongoing: "ongoing",                  --> timer begins upon first interaction
//     FinishedWin: "finishedWin",          --> option to see leaderboard, restart, analyse colour
//     FinishedLose: "finishedLose",        --> timer stops, maybe calculation of how far off?
//   };

import type { GameStatus } from "../gameConstants";

export interface ColourProportion {
  colour1: number;
  colour2: number;
  colour3: number;
  colour4: number;
}

export interface ColourGameState {
  status: GameStatus;
  mode: "RGBW" | "RYBW" | "CMYK" | null;
  timer: number;
  timerRunning: boolean;
  correctColourProportion: ColourProportion;
  currentColourProportion: ColourProportion;
  showWinPopup: boolean;
  showLosePopup: boolean;
  showHints: boolean;
}

export interface ColourGameAction {
  type: "SET_MODE";
  payload: "RGBW" | "RYBW" | "CMYK";
}
// initialise game
// start game
// Reset Game
// update current Colour Proportion
// Submit Attempt
// Win Game
// Lose Game
// Toggle Hint Mode

const colourGameReducer = (
  state: ColourGameState,
  action: ColourGameAction
) => {
  switch (action.type) {
    case "SET_MODE":
      break;
    default:
      state = state; //TODO to remove
      break;
  }
};

export { colourGameReducer };
