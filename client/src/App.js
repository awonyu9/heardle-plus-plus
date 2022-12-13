import './App.css';
// import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import { 
        accessToken,
        // logout,
        BASE_URL,
        OPTIONS
       } from './spotify';
import { catchErrors } from './utils';
// components:
import {
        LoginStep,
        PlaylistSelectionStep,
        GuessingStep,
        ResultsStep
       } from './components'

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  /* 
  0. login
  1. playlist selection
  2. guessing phase
  3. results page
  */

  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [chosenPlaylist, setChosenPlaylist] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [currentQuizTrack, setCurrentQuizTrack] = useState(null);
  const [currentUserGuess, setCurrentUserGuess] = useState(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  const [visitedPlaylists, setVisitedPlaylists] = useState({});
  const [score, setScore] = useState(0);

  const player = document.getElementById("player");
  // player.volume = 0.3;

  // console.log(visitedPlaylists);

  useEffect(() => {

    setToken(accessToken);

    async function getallPlaylists() {
      const params = new URLSearchParams({
        // limit: 3,
        // offset: 1,
      }).toString();
      // const limit = 3;
      // const offset = 1;
  
      const res = await fetch(`${BASE_URL}/me/playlists?`+ params, OPTIONS);
      const playlistsData = await res.json();
      // setPlaylists(playlists.items);
      // setPlaylistsData(playlists);

      // console.log(playlists.items);

      const total = playlistsData.total;

      var allPlaylists = []; // have to rename some of this

      var offset = 0
      const n_cycles = Math.ceil(total / 20);
      for (let i = 0; i < n_cycles; i++) {
        var response = await fetch(`${BASE_URL}/me/playlists?offset=${offset}`, OPTIONS);
        var morePlaylists = await response.json();
        // console.log("more:", morePlaylists.items);
        allPlaylists.push(morePlaylists.items);
        offset += 20;
      }
      setPlaylists(allPlaylists[0].concat(...allPlaylists.slice(1)));

    }

    accessToken && catchErrors(getallPlaylists());
    // console.log(playlists);
  }, [])

  // useEffect(() => {
  //   console.log("score:", score);

  // }, [score])

  // useEffect(() => {
  //   if (!playlistsData) {
  //     return;
  //   }

  //   async function fetchMorePlaylists() {
  //     if (playlistsData.next) {
  //       const res = await fetch(playlistsData.next, OPTIONS);
  //       const playlists = await res.json();
  //       setPlaylistsData(playlists);
  //     }
  //   }

  //   setPlaylists(playlists => ([
  //     ...playlists ? playlists : [],
  //     ...playlistsData.items
  //   ]));

  //   // console.log(typeof(playlistsData), typeof(playlistsData.items))
    
  //   catchErrors(fetchMorePlaylists());
  //   // console.log(playlistsData.next);

  // }, [playlistsData])

  // console.log("amount of playlists:", playlists && playlists.length);

  // maybe do this instead:
  // const [state, setState] = {
  //   profile: null,
  //   playlists: null
  // }

  // useEffect(() => {
  //   currentQuizTrack && console.log("current guessing track:", currentQuizTrack.name);
  // }, [currentQuizTrack])

  // useEffect(() => {
  //   chosenPlaylist && console.log("current playlist:", chosenPlaylist.name);
  // }, [chosenPlaylist])

  // useEffect(() => {
  //   console.log("current step:", currentStep);
  // }, [currentStep])

  // useEffect(() => {
  //   console.log(":", );
  // }, [])

  const themes = ["var(--heardle-plus-plus-pink)", "var(--heardle-plus-plus-green)", "goldenrod", "white"];

  function toggleTheme() {
    var root = document.querySelector(":root");
    var currColor = root.style.backgroundColor;
    // if (currColor === "var(--heardle-plus-plus-pink)") {
    //   root.style.backgroundColor = "var(--heardle-plus-plus-green)";
    // } else {
    //   root.style.backgroundColor = "var(--heardle-plus-plus-pink)";
    // }
    var currIndex = themes.indexOf(currColor);
    root.style.backgroundColor = themes[(currIndex+1) % themes.length];
  }
  
  return (
    <div className="App">
       <header className="App-header">
        <h1>Heardle++ (working title)</h1>
        {currentStep >= 1 &&
          <LoginStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            token={token}
          />
        }
        <button onClick={toggleTheme}>Toggle theme</button>
        <h4 style={{color: 'red'}}>Pro tip: Always refresh the page to see if an update is really working</h4>
        <hr />
       </header>


        {(token && playlists) &&
          <PlaylistSelectionStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            accessToken={accessToken}
            setChosenPlaylist={setChosenPlaylist}
            setTracks={setTracks}
            playlists={playlists}
            visitedPlaylists={visitedPlaylists}
            setVisitedPlaylists={setVisitedPlaylists}
          />
        }

        {chosenPlaylist &&
          <GuessingStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setGuess={setCurrentUserGuess}
            currentTrack={currentQuizTrack}
            setTrack={setCurrentQuizTrack}
            setIsGuessCorrect={setIsGuessCorrect}
            chosenPlaylist={chosenPlaylist}
            tracks={tracks}
            player={player}
            setScore={setScore}
          />
        }

        {currentUserGuess &&
          <ResultsStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            correctAnswer={isGuessCorrect}
            currentQuizTrack={currentQuizTrack}
            chosenPlaylist={chosenPlaylist}
            score={score}
          />
        }

        <audio id="player" preload="auto"></audio>
      
    </div>
  );
}
