// export type GameStatus =
//   | "pendingMode"
// player need to choose Mode type + Base type

//   | "initialisePlay"
// game will randomly generate objective - each input can be [0,4])
// game will show the objective & buttons & command bar (control (resets), stats (hints), timer)

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
import {
  type ColourMatchBasesFull,
  type ColourMatchBase,
  // ColourLevelDetails,
} from "./colourMatchConstants";

// ---------- Googled this
// Idea was to restrict typing to ensure proportions would have desired keys

// "`rgbBase${string}` ? K : never" ==> used to filter keys in indicated format
// "in" is used to loop and create a new object type if a property exists in an object
type KeysRGBBase<T> = {
  [K in keyof T as K extends `rgbBase${string}` ? K : never]: number;
  // {"rgbBase1": number; "rgbBase2": number; ... }
};

type BaseToProportion = {
  [K in ColourMatchBase]: KeysRGBBase<ColourMatchBasesFull[K]>;
  // ["rgbBase1", "rgbBase2", ... ]["RGBW" | "RYBW" | "CMYK" ]
};

// ---------- Type: Additional

interface ColourGameLevelTracker<
  Base extends ColourMatchBase = ColourMatchBase
> {
  currentLevel: number;
  currentRound: number;
  memory: {
    level: number;
    round: number;
    colorProportion: BaseToProportion[Base];
  }[];
}

// ---------- Typing State

interface ColourGameModelState<Base extends ColourMatchBase = ColourMatchBase> {
  status: GameStatus;
  playStyle: "Random" | "Levelled" | null;
  base: Base | undefined;
  correctColourProportion: BaseToProportion[Base] | undefined;
  currentColourProportion: BaseToProportion[Base] | undefined;
  progress: ColourGameLevelTracker | undefined;
  timer: {
    timerCount: number;
    timerIsRunning: boolean;
  };
  hintsModeIsOn: boolean; // RGB of 4 Colour Bases, RGB of Current Proportion, RGB of Correct Proportion
}

// To be Calculated:
// - RGB of Current Proportion
// - RGB of Correct Proportion

// interface ColourGameViewState {
//   showHints: boolean;
//   showBaseSelector: boolean;
//   showCommandSection: boolean;
//   showColourSelectors: boolean;
//   showColourProportions: boolean;
//   showAnswer: boolean;
//   showWinPopup: boolean;
//   showLosePopup: boolean;
// }

type ColourGameState = ColourGameModelState;

type ColourGameViewState = {
  showBaseSelector: boolean;
  showCommandSection: boolean;
  showColourSelectors: boolean;
  showColourProportions: boolean;
  showAnswer: boolean;
  showWinPopup: boolean;
  showLosePopup: boolean;
};

const initialColourGameState: ColourGameState = {
  status: "pendingMode",
  playStyle: null,
  base: undefined,
  correctColourProportion: undefined,
  currentColourProportion: undefined,
  progress: undefined,
  timer: {
    timerCount: 0,
    timerIsRunning: false,
  },
  hintsModeIsOn: false,
};

const getViewStateFromGameStatus = (
  status: GameStatus
): ColourGameViewState => ({
  showBaseSelector: status === "pendingMode",
  showCommandSection: status !== "pendingMode",
  showColourSelectors: status === "initialisePlay" || status === "ongoing",
  showColourProportions: status !== "pendingMode",
  showAnswer: status === "finishedWin" || status === "finishedLose",
  showWinPopup: status === "finishedWin",
  showLosePopup: status === "finishedLose",
});

// ---------- Typing Action

type ColourGameModelAction<Base extends ColourMatchBase = ColourMatchBase> =
  // | {
  //     type: "INITIALISE_PLAY";
  //     payload: {
  //       newGameStatus: GameStatus;
  //       newPlayStyle: "Random" | "Levelled";
  //     };
  //   }
  | {
      type: "SET_GAME_STATUS";
      payload: { newGameStatus: GameStatus };
    }
  | {
      type: "SET_PLAYSTYLE";
      payload: { newPlayStyle: "Random" | "Levelled" | null };
    }
  | {
      type: "SET_BASE";
      payload: { newBase: Base };
    }
  | {
      type: "SET_CORRECT_PROPORTION";
      payload: {
        newCorrectProportion: BaseToProportion[Base];
      };
    }
  | {
      type: "SET_CURRENT_PROPORTION";
      payload: {
        changeCurrentProportion: BaseToProportion[Base];
      };
    }
  | {
      type: "SET_PROGRESS_CURRENT";
    }
  | {
      type: "SET_PROGRESS_MEMORY";
    }
  | {
      type: "SUBMIT_ANSWER";
    }
  | { type: "RESET" };

type ColourGameViewAction = {
  type: "SET_VIEW_HINTS";
  payload: { isHintsShown: boolean };
};
// | {
//     type: "SET_VIEW_BASE_SELECTOR";
//     payload: { isBaseSelectorShown: boolean };
//   }
// | {
//     type: "SET_VIEW_COMMAND_SECTION";
//     payload: { isCommandSectionShown: boolean };
//   }
// | {
//     type: "SET_VIEW_COLOUR_SELECTORS";
//     payload: { isColourSelectorsShown: boolean };
//   }
// | {
//     type: "SET_VIEW_COLOUR_PROPORTIONS";
//     payload: { isColourSelectorsShown: boolean };
//   }
// | { type: "SET_VIEW_ANSWER"; payload: { isAnswerShown: boolean } }
// | { type: "SET_VIEW_WIN_POPUP"; payload: { isWinPopupShown: boolean } }
// | { type: "SET_VIEW_LOSE_POPUP"; payload: { isLosePopupShown: boolean } };

type ColourGameAction = ColourGameModelAction | ColourGameViewAction;

// ---------- Defining Reducer

const colourGameReducer = (
  state: ColourGameState,
  action: ColourGameAction
) => {
  switch (action.type) {
    case "RESET":
      // Model GameStatus set to pendingMode
      // may not be an option, might force back to start page
      return state;
    case "SET_PLAYSTYLE":
      // Model playStyle changes
      // Model GameStatus remains at pendingMode
      return { ...state, playStyle: action.payload.newPlayStyle };
    case "SET_BASE":
      // Model base changes
      // Model GameStatus set to initialisePlay
      return { ...state, base: action.payload.newBase };
    case "SET_CORRECT_PROPORTION":
      // Model correctColourProportion is calculated/randomised
      return state;
    case "SET_CURRENT_PROPORTION":
      return state;
    case "SUBMIT_ANSWER":
      return state;

    // --- View Action.types
    case "SET_VIEW_HINTS":
      return { ...state, showHints: action.payload.isHintsShown };
    // case "SET_VIEW_BASE_SELECTOR":
    //   return { ...state, showBaseSelector: action.payload.isBaseSelectorShown };
    // case "SET_VIEW_COMMAND_SECTION":
    //   return {
    //     ...state,
    //     showCommandSection: action.payload.isCommandSectionShown,
    //   };
    // case "SET_VIEW_COLOUR_SELECTORS":
    //   return {
    //     ...state,
    //     showColourSelectors: action.payload.isColourSelectorsShown,
    //   };
    // case "SET_VIEW_COLOUR_PROPORTIONS":
    //   return {
    //     ...state,
    //     showColourProportions: action.payload.isColourSelectorsShown,
    //   };
    // case "SET_VIEW_ANSWER":
    //   return { ...state, showAnswer: action.payload.isAnswerShown };
    // case "SET_VIEW_WIN_POPUP":
    //   return { ...state, showWinPopup: action.payload.isWinPopupShown };
    // case "SET_VIEW_LOSE_POPUP":
    //   return { ...state, showLosePopup: action.payload.isLosePopupShown };

    default:
      return state;
  }
};

export {
  colourGameReducer,
  initialColourGameState,
  getViewStateFromGameStatus,
  type ColourGameViewState,
};
