// export type GameStatus =
//   | "pendingMode"
// player need to choose Mode type + Base type

//   | "initialisePlay"
// game will randomly generate objective - each input can be [0,4])
// game will show the objective & buttons & command bar

//   | "ongoing"
// player makes first button click
// game will begin timer
// if hint button selected, RGB values are all shown

//   | "finishedWin"
// player to click submit button
// game will stop timer
// game will release confetti cannon
// game will ask player if want to save result and see leaderboard
// game will ask player to go to start page, choose new base, or go to colour page

//   | "finishedLose";
// game will stop timer
// game will show correct ratio
// game will ask player to go to start page, choose new base, or go to colour page

// ---

// export const GameStatus = {
//     PendingMode: "pendingMode",          --> allow choosing base colours
//     InitialisePlay: "initialisePlay",    --> final colour shown
//     Ongoing: "ongoing",                  --> timer begins upon first interaction
//     FinishedWin: "finishedWin",          --> option to see leaderboard, restart, analyse colour
//     FinishedLose: "finishedLose",        --> timer stops, maybe calculation of how far off?
//   };

import type { GameStatus } from "../../gameConstants";
import { ColourMatchBaseCore } from "./colourMatchConstants";

// ---------- Googled this
// Idea was to restrict typing to ensure proportions would have desired keys
// "in" is used to loop and create a new object type if a property exists in an object
type ColourMatchBase = keyof (typeof ColourMatchBaseCore)["base"];

// "`rgbBase${string}` ? K : never" ==> used to filter keys in indicated format
type ProportionOfExtractedKeysOfColourBase<T> = {
  [K in keyof T as K extends `rgbBase${string}` ? K : never]: number;
};

type ModeToProportion = {
  [K in ColourMatchBase]: ProportionOfExtractedKeysOfColourBase<
    (typeof ColourMatchBaseCore)["base"][K]
  >;
};

// ---------- Typing State & Action

// interface ColourGameModelState<Base extends ColourMatchBase = ColourMatchBase> {
//   status: GameStatus;
//   mode: "Random" | "Levelled" | null;
//   base: Base;
//   correctColourProportion: ModeToProportion[Base];
//   currentColourProportion: ModeToProportion[Base];
// }

// interface ColourGameViewState {
//   showColourSelectors: boolean;
//   showHints: boolean;
//   showAnswer: boolean;
// }

export interface ColourGameState<
  Base extends ColourMatchBase = ColourMatchBase
> {
  status: GameStatus;
  mode: "Random" | "Levelled" | null;
  base: Base;
  correctColourProportion: ModeToProportion[Base];
  currentColourProportion: ModeToProportion[Base];
  showColourSelectors: boolean;
  showHints: boolean;
  showAnswer: boolean;
  timer: number;
  timerRunning: boolean;
  showWinPopup: boolean;
  showLosePopup: boolean;
}

type ColourGameAction =
  | {
      type: "SET_MODE";
      payload: { newStatus: GameStatus; newMode: "Random" | "Levelled" | null };
    }
  | {
      type: "SET_BASE";
      payload: { newStatus: GameStatus; newBase: "RGBW" | "RYBW" | "CMYK" };
    }
  | {
      type: "SET_CORRECT_PROPORTION";
      payload: {
        newStatus: GameStatus;
        newCorrectProportion: number;
        newCurrentProportion: number;
        setShowColourSelectors: boolean;
      };
    }
  | {
      type: "SET_CURRENT_PROPORTION";
      payload: {
        newStatus: GameStatus;
        changeCurrentProportion: number;
        setShowHint?: boolean;
        setTimerRunning?: boolean;
      };
    }
  | {
      type: "SUBMIT_ANSWER";
      payload: {
        newStatus: GameStatus;
        setTimerRunning: boolean;
        setShowAnswer: boolean;
        setShowWinPopup?: boolean;
        setShowLosePopup?: boolean;
      };
    };

// initialise game
// start game
// Reset Game
// update current Colour Proportion
// Submit Attempt
// Win Game
// Lose Game
// Toggle Hint Mode

// ---------- Defining Reducer

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
