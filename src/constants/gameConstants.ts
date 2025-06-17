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
  | "pendingPlayStyle"
  | "initialisePlay"
  | "ongoing_play"
  | "ongoing_pause"
  | "finishedWin"
  | "finishedLose";
// Game Type = category of games
// Mode = A configuration or variation of the game’s rules or systems
// PlayStyle = how player interacts with the game or approaches it
// reserve feature for flag mode/ hints mode
