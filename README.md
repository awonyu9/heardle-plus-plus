# Heardle++

Heardle++ (working title) is an improved version of the web game Heardle, based on two core ideas:
1. The user should be able to quiz themselves on songs they might actually know - and not arbitrarily chosen "popular" Western songs.
2. The user should be able to play as many times as they want, and not just once per day.

From these two ideas was born Heardle++, a music quiz web app where people with Spotify accounts, can log in, select any of their public, private, shared and liked playlists, and quiz themselves on their own library's songs, as many times as they want.

## Screenshots

Here are screenshots of the playlist selection, guessing, and results phases:

<img src="https://user-images.githubusercontent.com/71611172/212188451-f21a35c9-c346-4379-be69-14b6c4e62030.png" width="500" />

*Playlist selection phase*

<img src="https://user-images.githubusercontent.com/71611172/212188470-bac226a1-d72b-4ac1-ad2c-6ea4d2311a1b.png" width="500" />

*Guessing phase*


<img src="https://user-images.githubusercontent.com/71611172/212188490-a08b2b7e-295d-4c89-ae77-aac9cb0f1b46.png" width="500" />

*Results phase*

## Installation
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
- The Express code is in the `index.js` file at the top level.
- The React code is in the `./client/src/` directory, specifically in the `App.js` file.
- All React components are located in the `./client/src/components/` directory.

## Future improvements

Right now, with deployment as a goal, I still need to improve the styling in CSS, and fix some minor bugs and quality-of-life issues, such as the play button not playing the track right away.

In the foreseeable future, I would like to connect Heardle++ to other music streaming platform APIs, such as Apple Music's or Pandora's.

The end goal will be to make Heardle++ available to anyone, whether they have a music streaming subscription or not. This would probably involve storing some pre-selected genre- or artist-specific playlists in a database of some sort.
