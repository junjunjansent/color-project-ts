# Color Project

- [Overall](#overall)
- [Pages of the Game](#pages-of-the-game)
- [User Stories](#user-stories)
- [Credits](#credits)

## Overall

### Background

### Challenges

- !!!! Typing Fetched Data :(
- Understanding Colour Theory
- Styling of pages on theme selection
- Inter navigation of colours
- Loading Page & Error page pop ups
- Leaderboard Forms & Time Management

### Page Structure

HomePage

- ColourGameStartPage
  - ColourAnalysis
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
  - [ ] As a user, I will be able to to choose between two options on the start page
    - Choosing Colour Analysis
      - Colour of choice via input
      - Random generated colour
    - Playing Colour Game
      - Random Colour
      - Levelled one (future)

- Colour Analysis (/game/colour/:id)

  - [x] As a user, with the selected colour, I will be able to see details of the selected colour (GET, API)
    - RGB value, id
    - Name & picture
    - See if got proportion of RGBW, RYBW, CMYK
    - Hex, HSV, HSL, CMYK
    - Complementary Colour
  - [ ] As a user, with the selected colour, closest match of a certain set of colours will be shown that will explain the emotion association [hard coded]
  - [ ] As a user, I will be given a list of themes where I can select them to transform the current page into the colour style I am looking at
    - ?? each theme has 6 colours:
      - Main Bg
      - Nav Bar
      - Big Font
      - Small Font
      - Buttons
      - Second Button
    - monochrome
    - monochrome-dark
    - monochrome-light
    - analogic, complement
    - analogic-complement
    - triad
    - quad
  - [x] As a user, i can also select the sub colours inside each theme, that would navigate to their colour analysis page

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
    - Head to colour Analysis of selected colour
    - Play Again
  - [ ] As a user, on the leaderboard form, I will be able to input my name as into the leaderboard form
  - [ ] As a user, upon submission of the form, I will see the leaderboard and my ranking
    - Airtable send information PUT (Name, Time, Colour obtained)
