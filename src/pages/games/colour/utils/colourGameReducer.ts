// export type GameStatus =
//   | "pendingMode"
// player need to choose Mode type, either levelled or random

//   | "pendingPlayStyle"
// player need to choose Base type

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
//     pendingPlayStyle: "pendingPlayStyle",          --> allow choosing base colours
//     InitialisePlay: "initialisePlay",    --> final colour shown
//     Ongoing: "ongoing",                  --> timer begins upon first interaction
//     FinishedWin: "finishedWin",          --> option to see leaderboard, restart, analyse colour
//     FinishedLose: "finishedLose",        --> timer stops, maybe calculation of how far off?
//   };

import type { GameStatus } from "../../../../constants/gameConstants";
import {
  type ColourMatchMode,
  type ColourMatchBase,
  type ColourMatchLevelDetail,
} from "../../../../constants/colour/colourMatchConstants";
import {
  setColourProportions,
  getColourMatchBase,
  getColourMatchLevelDetails,
} from "./colourMatchStateUtils";

// ---------- Type: Additional

interface ColourMatchLevelTracker {
  currentRound: number;
  currentLevel: number | "random";
  currentLevelDetails: ColourMatchLevelDetail;
  memory?: {
    level: number;
    round: number;
    colorProportion: Record<`rgbBase${string}`, number>;
  }[];
}

// ---------- Typing State

// TODO - TOLEARN: a bit difficult to type ColourProportion exactly :\
interface ColourGameModelState {
  gameStatus: GameStatus;
  matchMode?: ColourMatchMode;
  base?: ColourMatchBase; //i.e. playStyle
  correctColourProportion?: Record<`rgbBase${string}`, number>;
  currentColourProportion?: Record<`rgbBase${string}`, number>;
  progress?: ColourMatchLevelTracker;
  timerCount?: number | "Hint was Turned On";
  hintsFeatureIsOn: boolean; // RGB of 4 Colour Bases, RGB of Current Proportion, RGB of Correct Proportion
}

type ColourGameState = ColourGameModelState;

type ColourGameViewState = {
  showBaseSelector: boolean;
  showCommandBar: boolean;
  showIntro: boolean;
  showColourLabels: boolean;
  showColourSelectors: boolean;
  showWinPopup: boolean;
  showLosePopup: boolean;
};

const initialColourGameState: ColourGameState = {
  gameStatus: "pendingMode",
  matchMode: undefined,
  base: undefined,
  correctColourProportion: undefined,
  currentColourProportion: undefined,
  progress: undefined,
  timerCount: undefined,
  hintsFeatureIsOn: false,
};

const getViewStateFromGameStatus = (
  status: GameStatus
): ColourGameViewState => ({
  showBaseSelector: status === "pendingPlayStyle",
  showCommandBar: status !== "pendingMode" && status !== "pendingPlayStyle",
  showIntro: status === "initialisePlay",
  showColourLabels: status !== "pendingMode" && status !== "pendingPlayStyle",
  showColourSelectors: status === "initialisePlay" || status === "ongoing_play",
  showWinPopup: status === "finishedWin",
  showLosePopup: status === "finishedLose",
});

// ---------- Typing Action

type ColourGameModelAction =
  | { type: "PENDING_PLAYSTYLE_OF_RANDOM_PLAY" }
  | { type: "PENDING_PLAYSTYLE_OF_LEVELLED_PLAY" }
  | {
      type: "INITIALISE_PLAY";
      payload: { newBaseName: string };
    }
  | { type: "ONGOING_PLAY" }
  | { type: "ONGOING_PAUSE" }
  | {
      type: "CHANGE_COLOUR_PROPORTION";
      payload: {
        rgbBaseName: `rgbBase${string}`;
        delta: number;
      };
    }
  | { type: "RESET_CURRENT_PROPORTION" }
  | { type: "FINISH_GAME_WITH_WIN" }
  | { type: "FINISH_GAME_WITH_LOSE" };

type ColourGameViewAction = {
  type: "SET_VIEW_HINTS";
  payload: { hintsChecked: boolean };
};

type ColourGameAction = ColourGameModelAction | ColourGameViewAction;

// ---------- Defining Reducer

const colourGameReducer = (
  state: ColourGameState,
  action: ColourGameAction
): ColourGameState => {
  switch (action.type) {
    case "PENDING_PLAYSTYLE_OF_RANDOM_PLAY":
      return {
        ...initialColourGameState,
        gameStatus: "pendingPlayStyle",
        matchMode: "random",
      };
    case "PENDING_PLAYSTYLE_OF_LEVELLED_PLAY":
      return {
        ...initialColourGameState,
        gameStatus: "pendingPlayStyle",
        matchMode: "levelled",
      };
    case "INITIALISE_PLAY": {
      if (!state.matchMode) {
        throw new Error("No Play Style Selected to initialise Colour Game!");
      }

      //such declarations need to be scoped in {} within a case block
      const initialLevel = state.matchMode === "random" ? "random" : 1;

      return {
        ...state,
        gameStatus: "initialisePlay",
        base: getColourMatchBase(action.payload.newBaseName),
        correctColourProportion: setColourProportions(
          state.matchMode,
          action.payload.newBaseName,
          "random"
        ),
        currentColourProportion: setColourProportions(
          state.matchMode,
          action.payload.newBaseName,
          0
        ),
        progress: {
          currentRound: 1,
          currentLevel: initialLevel,
          currentLevelDetails: getColourMatchLevelDetails(initialLevel),
        },
      };
    }
    case "ONGOING_PLAY":
      return {
        ...state,
        gameStatus: "ongoing_play",
      };
    case "ONGOING_PAUSE":
      return {
        ...state,
        gameStatus: "ongoing_pause",
      };
    case "CHANGE_COLOUR_PROPORTION": {
      const { rgbBaseName, delta } = action.payload;

      if (delta > 0) {
        return {
          ...state,
          gameStatus: "ongoing_play",
          currentColourProportion: {
            ...state.currentColourProportion,
            [rgbBaseName]:
              (state.currentColourProportion?.[rgbBaseName] ?? 0) + delta,
          },
        };
      } else if (delta < 0) {
        if ((state.currentColourProportion?.[rgbBaseName] ?? 0) === 0) {
          return {
            ...state,
            gameStatus: "ongoing_play",
          };
        }

        return {
          ...state,
          gameStatus: "ongoing_play",
          currentColourProportion: {
            ...state.currentColourProportion,
            [rgbBaseName]:
              (state.currentColourProportion?.[rgbBaseName] ?? 0) - 1,
          },
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case "RESET_CURRENT_PROPORTION":
      if (!state.matchMode || !state.base) {
        throw new Error("No Play Style or Base to continue Colour Game!");
      }
      return {
        ...state,
        gameStatus: "ongoing_play",
        currentColourProportion: setColourProportions(
          state.matchMode,
          state.base.baseName,
          0
        ),
      };
    case "FINISH_GAME_WITH_WIN":
      return { ...state, gameStatus: "finishedWin" };
    case "FINISH_GAME_WITH_LOSE":
      return { ...state, gameStatus: "finishedLose" };

    // --- View Action.types
    case "SET_VIEW_HINTS":
      return {
        ...state,
        gameStatus: "ongoing_play",
        hintsFeatureIsOn: action.payload.hintsChecked,
      };

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
