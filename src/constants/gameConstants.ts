// it helps with code readability, prevent invalid cases, easier maintenance & type safety
// export const GameStatus = {
//   PendingMode: "pendingMode",
//   InitialisePlay: "initialisePlay",
//   Ongoing: "ongoing",
//   FinishedWin: "finishedWin",
//   FinishedLose: "finishedLose",
// };

export type GameStatus =
  | "pendingMode"
  | "initialisePlay"
  | "ongoing_play"
  | "ongoing_pause"
  | "finishedWin"
  | "finishedLose";
