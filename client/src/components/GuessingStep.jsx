import { useState, useEffect } from "react";
// import { catchErrors } from "../utils";
// import KeyboardReact from "react-simple-keyboard";
// import 'react-simple-keyboard/build/css/index.css';
// import layout from "simple-keyboard-layouts/build/layouts/japanese";
// import Player from './Player';

export default function GuessingStep(props) {
  
  var chosenPlaylistTrackNames = [];
  // console.log("chosen playlist: ", props.chosenPlaylist);
  if (props.chosenPlaylist) {
    // chosenPlaylistTrackNames = [];
    var chosenPlaylistTracks = props.chosenPlaylist.tracks.items;
    // console.log("the tracks: ", chosenPlaylistTracks);
    for (let i = 0; i < chosenPlaylistTracks.length; i++) {
      // console.log("a track:", chosenPlaylistTracks[i].track.name);
      chosenPlaylistTrackNames.push(chosenPlaylistTracks[i].track.name);
    }
    // console.log(chosenPlaylistTrackNames);
  }

  const [hasStarted, setHasStarted] = useState(false);
  // const [guessSoFar, setGuessSoFar] = useState("");
  
  // const currTrackLength = 3.0;

  if (props.currentStep !== 2) {
    return null;
  }

  // const keyboard = new KeyboardReact({
  //   onChange: handleKeyboardPress,
  //   ...layout,
  // })

  // console.log(props);

  function pickRandomSong() {
    props.setGuess(null);
    var randomIndex = Math.floor(Math.random() * props.tracks.length);
    const randomTrack = props.tracks[randomIndex].track;
    props.setTrack(randomTrack);
    const player = document.getElementById("player");
    player.src = randomTrack.preview_url;
    player.volume = 0.3;


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

  // async function showSuggestion(event) {
  //   var str = event.target.value;
  //   const suggestionBox = document.getElementById("suggestion");
  //   if (str === "") {
  //     suggestionBox.innerHTML = "";
  //   } else {
  //     const data = await fetch("http://127.0.0.1:80/Aburg/track_suggestions.php?q="+str);
  //     const res = await data.json();
  //     suggestionBox.innerHTML = res;
  //   }
  // }

  function showSuggestion(event) {
    // setGuessSoFar(event.target.value);
    // console.log(chosenPlaylistTrackNames);
    var suggestions = [];
    var gg = event.target.value.toLowerCase();
    for (let i = 0; i < chosenPlaylistTrackNames.length; i++) {
      var trackName = chosenPlaylistTrackNames[i].toLowerCase();
      
      if (trackName.includes(gg) && suggestions.length < 5) {
        suggestions.push(chosenPlaylistTrackNames[i]);
      }
    }
    document.getElementById("suggestions").innerHTML = suggestions.join(", ");
  }

  function toggleAudio() {
    const player = document.getElementById("player");
    const audioButton = document.querySelector(".audio-button");
    if (player.src.includes("mp3")) {
      if (player.paused) {
        player.play();
        audioButton.classList.remove("play-button");
        audioButton.classList.add("pause-button");
        // playerButton.innerHTML = pauseIcon;
      } else {
        player.pause();
        audioButton.classList.remove("pause-button");
        audioButton.classList.add("play-button");
        // playerButton.innerHTML = playIcon;
      }
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
            <div onClick={() => toggleAudio()} className="audio-button play-button">
            </div>
          </div>
          <input type="text" id="guess" placeholder="Guess track name" onChange={showSuggestion} />
          <p id="suggestions">suggestions placeholder</p>
          <button onClick={checkAnswer}>Submit</button>
        </div>
      }
      
      <div className="player"><audio id="player"></audio></div>
    </div>
  );
}

// {/* <input type="text" id="guess" placeholder="Guess track name" onKeyUp={catchErrors(showSuggestion)} /> */}
//       {/* {keyboard} */}
// {/* <p id="suggestion"></p> */}