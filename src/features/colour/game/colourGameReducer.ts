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
  type ColourGamePlayStyle,
  type ColourMatchBase,
  type ColourLevelDetail,
} from "./colourMatchConstants";
import {
  setColourProportions,
  getColourMatchBase,
  getColourLevelDetails,
} from "./colourMatchStateUtils";

// ---------- Type: Additional

interface ColourGameLevelTracker {
  currentRound: number;
  currentLevel: number | "random";
  currentLevelDetails: ColourLevelDetail;
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
  playStyle?: ColourGamePlayStyle;
  base?: ColourMatchBase;
  correctColourProportion?: Record<`rgbBase${string}`, number>;
  currentColourProportion?: Record<`rgbBase${string}`, number>;
  progress?: ColourGameLevelTracker;
  timerCount?: number | "Hint was Turned On";
  hintsModeIsOn: boolean; // RGB of 4 Colour Bases, RGB of Current Proportion, RGB of Correct Proportion
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
  playStyle: undefined,
  base: undefined,
  correctColourProportion: undefined,
  currentColourProportion: undefined,
  progress: undefined,
  timerCount: undefined,
  hintsModeIsOn: false,
};

const getViewStateFromGameStatus = (
  status: GameStatus
): ColourGameViewState => ({
  showBaseSelector: status === "pendingMode",
  showCommandBar: status !== "pendingMode",
  showIntro: status === "initialisePlay",
  showColourLabels: status !== "pendingMode",
  showColourSelectors: status === "initialisePlay" || status === "ongoing_play",
  showWinPopup: status === "finishedWin",
  showLosePopup: status === "finishedLose",
});

// ---------- Typing Action

type ColourGameModelAction =
  | { type: "PENDING_RANDOM_PLAY" }
  | { type: "PENDING_LEVELLED_PLAY" }
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
        changeType: "plus" | "minus";
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
    case "PENDING_RANDOM_PLAY":
      return {
        ...initialColourGameState,
        gameStatus: "pendingMode",
        playStyle: "random",
      };
    case "PENDING_LEVELLED_PLAY":
      return {
        ...initialColourGameState,
        gameStatus: "pendingMode",
        playStyle: "levelled",
      };
    case "INITIALISE_PLAY":
      if (!state.playStyle) {
        throw new Error("No Play Style Selected to initialise Colour Game!");
      }

      const playLevel = state.playStyle === "random" ? "random" : 1;

      return {
        ...state,
        gameStatus: "initialisePlay",
        base: getColourMatchBase(action.payload.newBaseName),
        correctColourProportion: setColourProportions(
          state.playStyle,
          action.payload.newBaseName,
          "random"
        ),
        currentColourProportion: setColourProportions(
          state.playStyle,
          action.payload.newBaseName,
          0
        ),
        progress: {
          currentRound: 1,
          currentLevel: playLevel,
          currentLevelDetails: getColourLevelDetails(playLevel),
        },
      };
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
    case "CHANGE_COLOUR_PROPORTION":
      const { rgbBaseName, changeType } = action.payload;

      if (changeType === "plus") {
        return {
          ...state,
          gameStatus: "ongoing_play",
          currentColourProportion: {
            ...state.currentColourProportion,
            [rgbBaseName]:
              (state.currentColourProportion?.[rgbBaseName] ?? 0) + 1,
          },
        };
      } else if (changeType === "minus") {
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
    case "RESET_CURRENT_PROPORTION":
      if (!state.playStyle || !state.base) {
        throw new Error("No Play Style or Base to continue Colour Game!");
      }
      return {
        ...state,
        gameStatus: "ongoing_play",
        currentColourProportion: setColourProportions(
          state.playStyle,
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
        hintsModeIsOn: action.payload.hintsChecked,
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
