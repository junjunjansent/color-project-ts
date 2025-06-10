# Color Project

- [Overall](#overall)
- [Pages of the Game](#pages-of-the-game)
- [User Stories](#user-stories)
- [Credits](#credits)

## Overall

### Background

I chose to implement this colour game/idea inspired by the idea of colour combination and also inspired by conversations of my friends about the importance of colour in design, even though I myself am slightly colour deficient. I wanted to expand the game design knowledge I learnt in Unit 1 as well as test my CSS side in implementing them in React.

- This continues on the challenge and desire to further build a portfolio for myself.

### Challenges

- Typescript

  - !!!! Typing Fetched Data :(
  - Typing Game Data

- Info

  - Understanding Colour Theory
  - Inconsistent Naming Conventions
  - Approximation of Colours due Human Perception vs Colour Values

- Other React

  - Styling of pages on theme selection
  - Inter navigation of colours & Routing
  - useMemo
  - useReducer
  - Loading Page & Error page pop ups

- Personal
  - Leaderboard Forms & Time Management
  - Writing React Cmoponent Functions vs. Pure Functions
  - Writing words/variables using UK vs US

### Page Structure

HomePage

- ColourGameStartPage
  - ColourAbout
  - Colour List
  - ColourMatchLevelled
  - ColourMatchRandom

## Pages of the Game

## User Stories

- Home Page

  - [x] As a user, I will see a Home Page that indicates the beginning of the web app
  - [x] As a user, i would see a loading page to indicate when components are still being rendered
  - [x] As a user, i would see an error page to indicate when a component is not found

- Colour Game Start Page (/game/colour/)

  - [x] As a user, I will see a Colour Game Start Page, with information on colour theory and brief information on the fe`atures available
    - Basic intro on Colour Theory
    - Potentially via Pop up boxes:
      - Colour & how their meaning is derived
      - Importance of Colour Schemes
  - [x] As a user, I will be able to to choose between two options on the start page
    - Choosing Colour Profile
      - Colour of choice via input
      - Random generated colour
      - Saved Colours
    - Playing Colour Game
      - Random Colour
      - Levelled one (future)

- Colour Profile (/game/colour/:id)

  - [x] As a user, with the selected colour, I will be able to see details of the selected colour (GET, API)
    - RGB value, id
    - Name & picture
    - See if got proportion of RGBW, RYBW, CMYK
    - Hex, HSV, HSL, CMYK
    - Complementary Colour
  - [x] As a user, closest named colours, if the current selection is not named, will be shown and I would be able to navigate to that colour's profile.
  - [x] As a user, with the selected colour, closest match of a certain set of colours will be shown that will explain the emotion association [hard coded]
  - [x] As a user, I will be given a list of themes where I can select them to transform the current page into the colour scheme I am looking at
    - Each scheme has 6 colours that will help to style features on the page such as:
      - Main Bg
      - Big Font
      - Small Font
      - Buttons
      - Second Button
    - Schemes available (based on API) include:
      - monochrome
      - monochrome-dark
      - monochrome-light
      - analogic, complement
      - analogic-complement
      - triad
      - quad
  - [x] As a user, I can see which colour scheme has been currently selected.
  - [x] As a user, I can also select the sub colours inside each theme, that would navigate to their colour profile page
  - [x] As a user, I can save a colour to a consolidated list so that I may revisit it if I wish.
  - [x] As a user, if a colour has been saved, I will be informed and am able to navigate to the consolidated saved list.

- Colour Game (/game/colour/match/)
  - [ ] As a user, I will be able to see a command bar that allows me to understand how the game works
  - [ ] As a user, from the command bar, I will be able to choose between 3 modes of gameplay
    - Additive RGBW
    - Subtractive RYBW
    - Subtractive CMYK
    - every selection will reset the time
  - [ ] As a user, from the command bar, I will be able to see the timer of how long I can complete the game
  - [ ] As a user, from the command bar, I will be able to click and view the leaderboard
  - [ ] As a user, after selection of the gameplay mode, I will be told that I can generate a given colour within a max of 15 moves so 18C4 (via stars and bars) = 816
  - [ ] As a user, I will be able to choose the selected combination of the four base colour inputs in order to match the given colour
  - [ ] As a user, I will be able to see the proportions of colour selected and the total number of moves colours and the resulting colour after the proportions have mixed in order in order to understand how close I am to obtaining the given colour
  - [ ] As a user, as long as the correct proportion of colour is obtained, I will be told I won and be given three options
    - Leaderboard Form
    - Head to colour Profile of selected colour
    - Play Again
  - [ ] As a user, on the leaderboard form, I will be able to input my name as into the leaderboard form
  - [ ] As a user, upon submission of the form, I will see the leaderboard and my ranking
    - Airtable send information PUT (Name, Time, Colour obtained)

## Overall

API/Info adopted from:

- [The Color API](https://thecolorapi.com)
- [Meaning of Colours](https://www.empower-yourself-with-color-psychology.com/meaning-of-colors.html)

Theory adopted from:

- [Luminance Calculation](https://www.w3.org/TR/WCAG20/relative-luminance.xml)
- [Contrast Calculation](https://www.w3.org/TR/WCAG20/#contrast-ratiodef)

Features adopted from:

<!-- - [Toggle Switch](https://uiverse.io/MuhammadHasann/popular-seahorse-73)
- [Confetti Animation](https://www.youtube.com/watch?v=hq_tKbSzAiY) -->
