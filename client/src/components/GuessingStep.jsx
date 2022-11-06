import { useState } from "react";

// import Player from './Player';

export default function GuessingStep(props) {
  // if (props.currentStep !== 3) {
  //   return null;
  // }

  // console.log(props);

  function pickRandomSong() {
    props.setGuess(null);
    var randomIndex = Math.floor(Math.random() * props.tracks.length);
    const randomTrack = props.tracks[randomIndex].track;
    props.setTrack(randomTrack);
    document.getElementById("player").src = randomTrack.preview_url;
  }

  function checkAnswer() {
    const userGuess = document.getElementById("guess").value.toLowerCase();
    // console.log(userGuess);
    const correctAnswer = props.currentTrack.name.toLowerCase();

    // console.log("guess:", userGuess);
    // console.log("answer:", correctAnswer);
    console.log("correct?", userGuess === correctAnswer);

    props.setGuess(userGuess);
    props.setIsGuessCorrect(userGuess === correctAnswer);
  }

  return (
    <div>
      <img width={"15%"} src={props.chosenPlaylist.images[0].url} alt={props.chosenPlaylist.name} />
      <h5>Chosen playlist: {props.chosenPlaylist.name}</h5>
      <button onClick={pickRandomSong}>Load player with random song</button>
      <audio id="player" controls></audio>
      <input type="text" id="guess" placeholder="Guess track name" />
      <button onClick={checkAnswer}>Submit</button>
    </div>
  );
}