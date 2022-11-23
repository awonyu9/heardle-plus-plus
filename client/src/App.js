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
  const [playlists, setPlaylists] = useState(null);
  const [chosenPlaylist, setChosenPlaylist] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [currentQuizTrack, setCurrentQuizTrack] = useState(null);
  const [currentUserGuess, setCurrentUserGuess] = useState(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);

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
      setPlaylists(playlists.items);
    }

    accessToken && catchErrors(getUserPlaylists());
  }, [])

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
