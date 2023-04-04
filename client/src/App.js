import './App.css';
import { useState, useEffect } from 'react';
import { 
        accessToken,
        BASE_URL,
        OPTIONS
       } from './spotify';
import { catchErrors } from './utils';
// components:
import {
        Header,
        PlaylistSelectionStep,
        GuessingStep,
        ResultsStep
       } from './components'

/**
 * Main app and container for all components of the game
 * @returns {JSX.Element}
 */
export default function App() {
  /* Game phases:
      0. login
      1. playlist selection
      2. guessing
      3. results
  */
  const [currentStep, setCurrentStep] = useState(1);
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [chosenPlaylist, setChosenPlaylist] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [currentQuizTrack, setCurrentQuizTrack] = useState(null);
  const [currentUserGuess, setCurrentUserGuess] = useState(null);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  // try a list of objects instead
  // const [visitedPlaylists, setVisitedPlaylists] = useState({});
  const [score, setScore] = useState(0);

  const player = document.getElementById("player");

  useEffect(() => {
    setToken(accessToken);

    /**
     * Fetches all the user's playlists, not just the first 20 that are given
     * @returns  {void}
     */
    async function getAllPlaylists() {
      const params = new URLSearchParams({
        // limit: 3,
        // offset: 1,
      }).toString();
  
      const res = await fetch(`${BASE_URL}/me/playlists?`+ params, OPTIONS);
      const { total } = await res.json();

      // const total = playlistsData.total;

      var allPlaylists = [];

      var offset = 0;
      const n_cycles = Math.ceil(total / 20);

      for (let i = 0; i < n_cycles; i++) {
        var response = await fetch(`${BASE_URL}/me/playlists?offset=${offset}`, OPTIONS);
        var morePlaylists = await response.json();
        allPlaylists.push(morePlaylists.items);
        offset += 20;
      }
      setPlaylists(allPlaylists[0].concat(...allPlaylists.slice(1)));
    }

    accessToken && catchErrors(getAllPlaylists());
  }, [])
  
  return (
    <div className="App">
        <Header
          token={token}
          setCurrentStep={setCurrentStep}
        />

        {(token && playlists) &&
          <PlaylistSelectionStep
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            // accessToken={accessToken}
            setChosenPlaylist={setChosenPlaylist}
            setTracks={setTracks}
            playlists={playlists}
            // visitedPlaylists={visitedPlaylists}
            // setVisitedPlaylists={setVisitedPlaylists}
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
