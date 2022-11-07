import { useEffect } from "react";
import { catchErrors } from "../utils";
// import Player from './Player';

export default function GuessingStep(props) {
  useEffect(() => {
    // need to load player with random song when component is mounted
  }, []);

  if (props.currentStep !== 2) {
    return null;
  }

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

    console.log(typeof(userGuess));
    props.setGuess(userGuess ? userGuess : " ");
    // props.setGuess(userGuess);
    props.setIsGuessCorrect(userGuess === correctAnswer);
    props.setCurrentStep(3);
  }

  async function showSuggestion(event) {
    var str = event.target.value;
    const suggestionBox = document.getElementById("suggestion");
    if (str === "") {
      suggestionBox.innerHTML = "";
    } else {
      const data = await fetch("http://127.0.0.1:80/Aburg/track_suggestions.php?q="+str);
      const res = await data.json();
      suggestionBox.innerHTML = res;
    }
  }

  return (
    <div>
      <img width={"15%"} src={props.chosenPlaylist.images[0].url} alt={props.chosenPlaylist.name} />
      <h5>Chosen playlist: {props.chosenPlaylist.name}</h5>
      <button onClick={pickRandomSong}>Load player with random song</button>
      <audio id="player" controls></audio>
      <input type="text" id="guess" placeholder="Guess track name" onKeyUp={catchErrors(showSuggestion)} />
      <p id="suggestion"></p>
      <button onClick={checkAnswer}>Submit</button>
    </div>
  );
}