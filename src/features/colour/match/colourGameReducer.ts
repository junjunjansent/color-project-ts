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
  type ColourMatchBaseNames,
  type ColourGamePlayStyle,
} from "./colourMatchConstants";
import { randomiseColourProportions } from "./colourMatchUtils";

// ---------- Type: Additional

interface ColourGameLevelTracker {
  currentLevel: number;
  currentRound: number;
  memory: {
    level: number;
    round: number;
    colorProportion: Record<string, number>;
  }[];
}

// ---------- Typing State

// TODO - TOLEARN: a bit difficult to type ColourProportion exactly :\
interface ColourGameModelState {
  gameStatus: GameStatus;
  playStyle: ColourGamePlayStyle | undefined;
  base: ColourMatchBaseNames | undefined;
  correctColourProportion: Record<string, number> | undefined;
  currentColourProportion: Record<string, number> | undefined;
  progress: ColourGameLevelTracker | undefined;
  timer:
    | {
        timerCount: number;
        timerIsRunning: boolean;
      }
    | undefined;
  hintsModeIsOn: boolean; // RGB of 4 Colour Bases, RGB of Current Proportion, RGB of Correct Proportion
}

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
  gameStatus: "pendingMode",
  playStyle: undefined,
  base: undefined,
  correctColourProportion: undefined,
  currentColourProportion: undefined,
  progress: undefined,
  timer: undefined,
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

type ColourGameModelAction =
  | {
      type: "PENDING_RANDOM_PLAY";
    }
  | {
      type: "INITIALISE_PLAY";
      payload: { newBase: ColourMatchBaseNames };
    }
  // | {
  //     type: "INITIALISE_PLAY";
  //     payload: {
  //       newGameStatus: GameStatus;
  //       newPlayStyle: "Random" | "Levelled";
  //     };
  //   }
  // | {
  //     type: "INITIALISE";
  //   }
  | {
      type: "SET_GAME_STATUS";
      payload: { newGameStatus: GameStatus };
    }
  | {
      type: "SET_PLAYSTYLE";
      payload: { newPlayStyle: ColourGamePlayStyle };
    }
  | {
      type: "SET_BASE";
      payload: { newBase: ColourMatchBaseNames };
    }
  | {
      type: "SET_CORRECT_PROPORTION";
      payload: {
        newCorrectProportion: Record<string, number>;
      };
    }
  | {
      type: "SET_CURRENT_PROPORTION";
      payload: {
        changeCurrentProportion: Record<string, number>;
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
): ColourGameState => {
  switch (action.type) {
    case "PENDING_RANDOM_PLAY":
      return {
        ...initialColourGameState,
        gameStatus: "pendingMode",
        playStyle: "random",
      };
    case "INITIALISE_PLAY":
      if (!state.playStyle) {
        throw new Error("No Play Style Selected to initialise Colour Game!");
      }
      return {
        ...state,
        gameStatus: "initialisePlay",
        base: action.payload.newBase,
        correctColourProportion: randomiseColourProportions(
          state.playStyle,
          action.payload.newBase
        ),
      };
    case "SET_BASE":
      return { ...state, base: action.payload.newBase };
    // case "INITIALISE":
    //   return { initialColourGameState };
    case "RESET":
      // Model GameStatus set to pendingMode
      // may not be an option, might force back to start page
      return state;
    case "SET_PLAYSTYLE":
      // Model playStyle changes
      // Model GameStatus remains at pendingMode
      return { ...state, playStyle: action.payload.newPlayStyle };
    case "SET_CORRECT_PROPORTION":
      // Model correctColourProportion is calculated/randomised
      return state;
    case "SET_CURRENT_PROPORTION":
      return state;
    case "SUBMIT_ANSWER":
      return state;

    // --- View Action.types
    case "SET_VIEW_HINTS":
      return { ...state, hintsModeIsOn: action.payload.isHintsShown };
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
