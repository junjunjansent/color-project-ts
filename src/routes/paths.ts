export const PATHS = {
  HOME: "/",
  GAME: {
    COLOUR: {
      START: "/game/colour",
      COLOUR_ID: (id: string) => `/game/colour/${id}`,
      LIST: "/game/colour/list",
      MATCH_LEVELLED: "/game/colour/matchLevelled",
      MATCH_RANDOM: "/game/colour/matchRandom",
    },
  },
  ERROR: "*",
};
