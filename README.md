# Heardle++
---

## Project description
Heardle++ is an improved version of the web game Heardle, based on two core ideas:
1. The user should be able to quiz themselves on songs they might actually know - and not arbitrarily chosen "popular" Western songs.
2. The user should be able to play as many times as they want, and not just once per day.

From these two ideas was born Heardle++ (working title), a music quiz web app where people with Spotify accounts, can log in, select any of their public, private, shared and liked playlists, and quiz themselves on their own library's songs, as many times as they want.

## Installation (for CS 460 purposes)
1. Unzip heardle-plus-plus.zip
2. In the heardle-plus-plus directory, open your terminal and run `npm install`. This will install all the project's dependencies.
3. To run the React app, run `npm start`. This will automatically open a tab that points to `localhost:3000`, where Heardle++ runs.

*A Spotify account is required to fully use the app.*

*As this app is still in development, any user would have to be added to a list of authorised users.*

## Technologies used
- The front-end was developed in React.
- The back-end consists of an Express server that handles the OAuth process.
- The Spotify Web API was used to retrieve the user's playlist and track data.

## Directory structure
- The `index.js` file at the top level contains the Express code.
- The React code is in the `./client/src/` directory, specifically in the `App.js` file,
- All components are located in the `./client/src/components/` directory.

## Immediate future improvements
I would like to connect Heardle++ to other music streaming platform APIs, such as Apple Music's or Pandora's.

The end goal will be to make Heardle++ available to anyone, whether they have a music streaming subscription or not. This would probably involve storing some pre-selected genre- or artist-specific playlists in a database of some sort.