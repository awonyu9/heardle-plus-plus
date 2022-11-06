import './App.css';
// import styled from 'styled-components/macro';
import { useState, useEffect } from 'react';
import { 
        accessToken,
        logout,
       } from './spotify';
import { catchErrors } from './utils';
// components:
// import LoginStep from './components/LoginStep';
// import PlaylistSelectionStep from './components/PlaylistSelectionStep';
import GuessingStep from './components/GuessingStep';
import ResultsStep from './components/ResultsStep';

export default function App() {
  // const [currentStep, setCurrentStep] = useState(1);
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

    // async function fetchData() {
    //   const playlists = await getUserPlaylists();
    //   setPlaylists(playlists.items);
    // }
    // catchErrors(fetchData());
  }, [])

  // maybe do this instead:
  // const [state, setState] = {
  //   profile: null,
  //   playlists: null
  // }

  const BASE_URL = "https://api.spotify.com/v1";
  const OPTIONS = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    }
  }

  function handleGuessChange(event) {
    setCurrentUserGuess(event.target.value);
  }

  // function handleChange(event) {
  //   const {name, value} = event.target;
  //   setState({
  //       ...state,
  //       [name]: value
  //   });
  // }
  

  async function getUserPlaylists() {
    const limit = 3;
    const offset = 15;

    // const playlists = await getUserPlaylists();
    try {
      const res = await fetch(`${BASE_URL}/me/playlists?limit=${limit}&offset=${offset}`, OPTIONS);
      const playlists = await res.json();
      setPlaylists(playlists.items);
    } catch (error) {
      console.log(error);
    }
  }

  async function choosePlaylist(playlistId) {
    // const playlistId = "37i9dQZF1EVJSvZp5AOML2";
    // var rn = Math.floor(Math.random() * playlists.length);
    // var playlistId = playlists[rn].id;
    try {
      const res = await fetch(`${BASE_URL}/playlists/${playlistId}`, OPTIONS);
      const playlist = await res.json();
      setChosenPlaylist(playlist);
      setTracks(playlist.tracks.items);
    } catch (error) {
      console.log(error);
    }
  }
  // figured that the root of the problem, is that when we use useEffect
  // or call function here, it makes an infinite number of calls
  // so we get a 429 error
  // fix: map API call to button click

  // catchErrors(fetchData());
  // fetchData();

  // console.log("playlists:", playlists);
  // console.log("chosen playlist:", chosenPlaylist)
  // console.log("tracks from one playlist:", tracks);

  function renderPlaylists() {
    if (playlists) {
      return playlists.map(playlist => (
        <div className="playlist" key={playlist.id}>
          <img width={"35%"} src={playlist.images[0].url} alt={playlist.name} onClick={() => catchErrors(choosePlaylist(playlist.id))} />
          <p>{playlist.name}</p>
        </div>
      ))
    }
  }

  // function pickRandomSong() {
  //   setCurrentUserGuess(null);
  //   var randomIndex = Math.floor(Math.random() * tracks.length);
  //   const randomTrack = tracks[randomIndex].track;
  //   setCurrentQuizTrack(randomTrack);
  //   document.getElementById("player").src = randomTrack.preview_url;
  // }

  useEffect(() => {
    currentQuizTrack && console.log("current guessing track:", currentQuizTrack.name);
  }, [currentQuizTrack])

  useEffect(() => {
    currentUserGuess && console.log("current user guess:", currentUserGuess);
  }, [currentUserGuess])

  // useEffect(() => {
  //   isGuessCorrect && console.log("is guess correct:", isGuessCorrect);
  // }, [isGuessCorrect])

  // useEffect(() => {
  //   console.log();
  // }, [])
  
  // function checkAnswer() {
  //   const userGuess = document.getElementById("guess").value.toLowerCase();
  //   const correctAnswer = currentQuizTrack.name.toLowerCase();

  //   // console.log("guess:", userGuess);
  //   // console.log("answer:", correctAnswer);
  //   console.log("correct?", userGuess === correctAnswer);

  //   setCurrentUserGuess(userGuess);
  //   setIsGuessCorrect(userGuess === correctAnswer);
  // }

  return (
    <div className="App">
       <header className="App-header">
        <h1>Quizify (Heardle++)</h1>
        <hr />
       </header>

        <p>
       {!token ?
          <button><a href="http://localhost:8888/login">Log in
              to Spotify</a></button>
          : <button onClick={logout} className="logout">Log out</button>}
        </p>
        <hr />

        {token && 
          <button onClick={catchErrors(getUserPlaylists)}>Start</button>
        }

        <div className="playlists">{renderPlaylists()}</div>

        {/* {chosenPlaylist &&
        <div>
          <img width={"15%"} src={chosenPlaylist.images[0].url} alt={chosenPlaylist.name} />
          <h5>Chosen playlist: {chosenPlaylist.name}</h5>
          <button onClick={pickRandomSong}>Load player with random song</button>
          <audio id="player" controls></audio>
          <input type="text" id="guess" placeholder="Guess track name" />
          <button onClick={checkAnswer}>Submit</button>
        </div>
        } */}

        {chosenPlaylist &&
          <GuessingStep
            // currentStep={currentStep}
            setGuess={setCurrentUserGuess}
            currentTrack={currentQuizTrack}
            setTrack={setCurrentQuizTrack}
            setIsGuessCorrect={setIsGuessCorrect}
            handleGuessChange={handleGuessChange}
            chosenPlaylist={chosenPlaylist}
            tracks={tracks}
          />
        }

        {currentUserGuess &&
          <ResultsStep
            // currentStep={currentStep}
            correctAnswer={isGuessCorrect}
            currentQuizTrack={currentQuizTrack}
            chosenPlaylist={chosenPlaylist}

          />
        }

       {/* <LoginStep
          currentStep={currentStep}
          moveOn={setCurrentStep}
          token={accessToken}
       />

       <PlaylistSelectionStep
          currentStep={currentStep}
          moveOn={setCurrentStep}
          setTracks={setTracks}
       />

        */}

      
    </div>
  );
}
