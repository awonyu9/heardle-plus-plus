<div align="center">
  <a href="https://github.com/awonyu9/math-lab-resources">
    <img src="./readme-assets/heardle-plus-plus-logo.png" alt="Logo" width="80" height="80" style="background-color: white">
  </a>
  <h1>Heardle++</h1>
  <p>
    Heardle++ is an improved version of the web game Heardle, based on two core ideas:
    <ol>
      <li>The user should be able to quiz themselves on songs they might actually know - and not arbitrarily chosen "popular" Western songs.</li>
      <li>The user should be able to play as many times as they want, and not just once per day.</li>
    </ol>
  </p>
  <p>
    From these two ideas was born Heardle++, a music quiz web app where people with Spotify accounts, can log in, select any of their public, private, shared and liked playlists, and quiz themselves on their own library's songs, as many times as they want.
  </p>
</div>

## About The Project

Here is a short video showing how Heardle++ works:

<!-- <video src="./readme-assets/heardle-plus-plus.mp4"> -->

## Technologies used
- The front-end was developed in React.
- The back-end consists of an Express server that handles the OAuth process.
- The Spotify Web API was used to retrieve the user's playlist and track data.

## Directory structure
- The Express code is in the `index.js` file at the top level.
- The React code is in the `./client/src/` directory, specifically in the `App.js` file.
- All React components are located in the `./client/src/components/` directory.

## Screenshots

Additionally, here are screenshots of the playlist selection, guessing, and results phases, for both desktop and mobile:

### Desktop

<img src="./readme-assets/heardle-plus-plus-1.png" width="500" />

*Playlist selection phase on desktop*

<img src="./readme-assets/heardle-plus-plus-2.png" width="500" />

*Guessing phase on desktop*

<img src="./readme-assets/heardle-plus-plus-3.png" width="500" />

*Results phase on desktop*

<img src="./readme-assets/heardle-plus-plus-mobile-1.png" width="200" />

### Mobile

*Playlist selection phase on mobile*

<img src="./readme-assets/heardle-plus-plus-mobile-2.png" width="200" />

*Guessing phase on mobile*

<img src="./readme-assets/heardle-plus-plus-mobile-3.png" width="200" />

*Results phase on mobile*

## Installation
1. Unzip heardle-plus-plus.zip
2. In the heardle-plus-plus directory, open your terminal and run `npm install`. This will install all the project's dependencies.
3. To run the React app, run `npm start`. This will automatically open a tab that points to `localhost:3000`, where Heardle++ runs.

*A Spotify account is required to fully use the app.*

*As this app is still in development, any user would have to contact me to be added to a list of authorised users.*

## Future improvements

In the foreseeable future, I would like to connect Heardle++ to other music streaming platform APIs, such as Apple Music's or Pandora's.

The end goal will be to make Heardle++ available to anyone, whether they have a music streaming subscription or not. This would probably involve storing some pre-selected genre- or artist-specific playlists in a database of some sort.
