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
  1. login
  2. playlist selection
  3. guessing phase
  4. results page
  */

  const [token, setToken] = useState(null);
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [chosenPlaylist, setChosenPlaylist] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [currentQuizTrack, setCurrentQuizTrack] = useState(null);
  const [currentUserGuess, setCurrentUserGuess] = useState(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  const [visitedPlaylists, setVisitedPlaylists] = useState({});

  // console.log(visitedPlaylists);

  useEffect(() => {

    setToken(accessToken);

    async function getUserPlaylists() {
      const params = new URLSearchParams({
        // limit: 3,
        // offset: 1,
      }).toString();
      // const limit = 3;
      // const offset = 1;
  
      const res = await fetch(`${BASE_URL}/me/playlists?`+ params, OPTIONS);
      const playlists = await res.json();
      // setPlaylists(playlists.items);
      // setPlaylistsData(playlists);

      // console.log(playlists.items);

      const total = playlists.total;
      console.log(total, playlists.next);

      var userPlaylists = []; // have to rename some of this

      var offset = 0
      const n_cycles = Math.ceil(total / 20);
      for (let i = 0; i < n_cycles; i++) {
        var response = await fetch(`${BASE_URL}/me/playlists?offset=${offset}`, OPTIONS);
        var morePlaylists = await response.json();
        // console.log("more:", morePlaylists.items);
        userPlaylists.push(morePlaylists.items);
        offset += 20;
      }
      var allPlaylists = userPlaylists[0].concat(...userPlaylists.slice(1));
      setPlaylists(allPlaylists);

    }

    accessToken && catchErrors(getUserPlaylists());
    console.log(playlists);
  }, [])

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
  
  return (
    <div className="App">
       <header className="App-header">
        <h1>Quizify (Heardle++)</h1>
        {currentStep >= 1 &&
          <LoginStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            token={token}
          />
        }
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
          />
        }

        {currentUserGuess &&
          <ResultsStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            correctAnswer={isGuessCorrect}
            currentQuizTrack={currentQuizTrack}
            chosenPlaylist={chosenPlaylist}
          />
        }
      
    </div>
  );
}
