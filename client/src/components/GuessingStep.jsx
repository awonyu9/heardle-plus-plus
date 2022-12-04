import { useEffect } from "react";
import { useState } from "react";
// import { catchErrors } from "../utils";
// import KeyboardReact from "react-simple-keyboard";
// import 'react-simple-keyboard/build/css/index.css';
// import layout from "simple-keyboard-layouts/build/layouts/japanese";
// import Player from './Player';

export default function GuessingStep(props) {

  const [suggestions, setSuggestions] = useState([]);
  const songAmount = 3;
  
  var chosenPlaylistTrackNames = [];

  // const player = document.getElementById("player");
  const player = props.player;
  // console.log(player);
  

  var currPlayableTracks = props.tracks;

  if (currPlayableTracks) {
    for (let i = 0; i < currPlayableTracks.length; i++) {
      chosenPlaylistTrackNames.push(currPlayableTracks[i].track.name);
    }
    chosenPlaylistTrackNames = [...new Set(chosenPlaylistTrackNames)];
  }

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    console.log(player.paused ? "paused" : "playing");
  }, [player])

  if (props.currentStep !== 2) {
    return null;
  }

  // const keyboard = new KeyboardReact({
  //   onChange: handleKeyboardPress,
  //   ...layout,
  // })

  // console.log(props);

  function pickRandomSong() {
    // error here where sometimes clicking doesn't fetch a song
    // poses problems when removing eligible items as we do here
    props.setGuess(null);
    setSuggestions([]);
    // console.log(currPlayableTracks[0]);
    var randomIndex = Math.floor(Math.random() * currPlayableTracks.length);
    const randomTrack = currPlayableTracks[randomIndex].track;
    console.log("answer:", randomTrack.name);
    props.setTrack(randomTrack);
    // currPlayableTracks.splice(randomIndex, 1);

    // const player = document.getElementById("player");
    player.src = randomTrack.preview_url + `#t=0,${songAmount}`; // START HERE
    player.volume = 0.3;
    // player.preload = "auto"; // AND HERE

    // const player = document.getElementById("player");
    // console.log(player.src, player.srcObject);

    setHasStarted(true);
  }

  function checkAnswer() {
    const userGuess = document.getElementById("guess").value.toLowerCase();
    // console.log(userGuess);
    const correctAnswer = props.currentTrack.name.toLowerCase();

    // console.log("guess:", userGuess);
    // console.log("answer:", correctAnswer);
    console.log("correct?", userGuess === correctAnswer);

    
    props.setGuess(userGuess ? userGuess : " ");
    // props.setGuess(userGuess);
    props.setIsGuessCorrect(userGuess === correctAnswer);
    setHasStarted(false);
    props.setCurrentStep(3);
  }


  function showSuggestion(event) {
    // setGuessSoFar(event.target.value);
    // console.log(chosenPlaylistTrackNames);
    var suggestions = [];
    var guessSoFar = event.target.value.toLowerCase();
    for (let i = 0; i < chosenPlaylistTrackNames.length; i++) {
      var trackName = chosenPlaylistTrackNames[i].toLowerCase();
      
      if (trackName.includes(guessSoFar) && suggestions.length < 5) {
        suggestions.push(chosenPlaylistTrackNames[i]);
      }
    }
    
    setSuggestions(suggestions);
    // document.getElementById("suggestions").innerHTML = suggestions.join(", ");
  }

  function renderSuggestions() {
    if (suggestions) {
      return suggestions.map((suggestion, i) => (
        <li
          key={i}
          className="autosuggestion"
          onClick={() => document.getElementById("guess").value = suggestion}
        >
          {suggestion}
        </li>
        
      ))
    }
  }

  function toggleAudio() {
    // const player = document.getElementById("player");
    const audioButton = document.querySelector(".audio-button");
    if (player.src.includes("mp3")) {
      player.play();
      audioButton.classList.remove("play-button");
      audioButton.classList.add("pause-button");
      setTimeout(() => {
        player.pause();
        audioButton.classList.remove("pause-button");
        audioButton.classList.add("play-button");
      }, songAmount*1000)
      player.currentTime = 0;
      
      // if (player.paused) {
      //   player.play();
      //   // console.log("playing");
      //   audioButton.classList.remove("play-button");
      //   audioButton.classList.add("pause-button");
      //   setInterval(() => { // START HERE, need to rethink this logic
      //     player.pause();
      //     player.currentTime = 0;
      //     audioButton.classList.remove("pause-button");
      //     audioButton.classList.add("play-button");
      //   }, 3000)
      //   // playerButton.innerHTML = pauseIcon;
      // } else {
      //   player.pause();
      //   // console.log("paused");
      //   audioButton.classList.remove("pause-button");
      //   audioButton.classList.add("play-button");
      //   // playerButton.innerHTML = playIcon;
      // }
    } else {
      pickRandomSong();
    }
  }

  // function handleKeyboardPress(event) {
  //   document.getElementById("guess").value = event.target.value;
  // }

  return (
    <div>
      <img width={"15%"} src={props.chosenPlaylist.images[0].url} alt={props.chosenPlaylist.name} />
      <h5>{props.chosenPlaylist.name}</h5>
      {!hasStarted && <button onClick={pickRandomSong}>Click here to start</button>}
      {hasStarted &&
        <div>
          <div className="audio-buttons">
            <div onClick={toggleAudio} className="audio-button play-button">
              {/* onClick={() => toggleAudio} */}
            </div>
          </div>

          <div className="autosuggest_wrapper">
            <input
              type="text"
              id="guess"
              className="userGuess"
              placeholder="Guess song title"
              onKeyUp={showSuggestion}
            />
            <ul className="suggestionList_scrollable">{renderSuggestions()}</ul>
          </div>
          <button onClick={checkAnswer}>Submit</button>
        </div>
      }
      
      <div className="player">
        <audio id="player"></audio>
      </div>
    </div>
  );
}

// {/* <input type="text" id="guess" placeholder="Guess track name" onKeyUp={catchErrors(showSuggestion)} /> */}
//       {/* {keyboard} */}
// {/* <p id="suggestion"></p> */}