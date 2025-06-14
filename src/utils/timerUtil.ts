import { type GameStatus } from "../features/gameConstants";

type TimerState = {
  timerIsRunning: boolean;
};

const getTimerIsRunningFromGameStatus = (status: GameStatus): TimerState => ({
  timerIsRunning: status === "ongoing_play",
});

export { type TimerState, getTimerIsRunningFromGameStatus };
