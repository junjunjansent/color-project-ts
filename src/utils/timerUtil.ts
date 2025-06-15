import { type GameStatus } from "../constants/gameConstants";

type TimerState = {
  timerIsRunning: boolean;
};

const getTimerIsRunningFromGameStatus = (status: GameStatus): TimerState => ({
  timerIsRunning: status === "ongoing_play",
});

export { type TimerState, getTimerIsRunningFromGameStatus };
