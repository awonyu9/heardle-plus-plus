import { useState } from "react";

/**
 * Component that encloses the guessing phase of the game
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function GuessingStep(props) {
  const [suggestions, setSuggestions] = useState([]);

  const trackAvailableSeconds = 3;
  const player = props.player;
  var chosenPlaylistTrackNames = [];
  var currPlayableTracks = props.tracks;

  if (currPlayableTracks) {
    for (let i = 0; i < currPlayableTracks.length; i++) {
      chosenPlaylistTrackNames.push(currPlayableTracks[i].track.name);
    }
    chosenPlaylistTrackNames = [...new Set(chosenPlaylistTrackNames)];
  }

  const [hasStarted, setHasStarted] = useState(false);

  if (props.currentStep !== 2) {
    return null;
  }

  /**
   * Generates a random number and indexes list of playlist tracks,
   * sets currentTrack to that track's title,
   * and loads HTMLAudioElement with the track's preview URL
   * @returns {void}
   */
  function pickRandomSong() {
    props.setGuess(null);
    setSuggestions([]);

    var randomIndex = Math.floor(Math.random() * currPlayableTracks.length);
    const randomTrack = currPlayableTracks[randomIndex].track;
    console.log("answer:", randomTrack.name);
    props.setTrack(randomTrack);

    player.src = randomTrack.preview_url + `#t=0,${trackAvailableSeconds}`; // START HERE
    player.volume = 0.3;

    setHasStarted(true);
  }

  /**
   * Sets isGuessCorrect to true or false depending on whether user input matches the current song title
   * and increments score if user guess is correct
   * @returns {void}
   */
  function checkAnswer() {
    const userGuess = document.getElementById("guess").value.toLowerCase();
    const correctAnswer = props.currentTrack.name.toLowerCase();

    // console.log("answer:", correctAnswer);

    props.setGuess(userGuess ? userGuess : " ");
    props.setIsGuessCorrect(userGuess === correctAnswer);
    if (userGuess === correctAnswer) {
      props.setScore(prev => prev + 1);
    }

    setHasStarted(false);
    props.setCurrentStep(3);
  }

  /**
   * Sets suggestions array to a list of up to five tracks from the chosen playlist
   * that match with the user input
   * @param {EventObject} event
   * @returns {void}
   */
  function generateSuggestions(event) {
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
  }

  /**
   * Renders the list of track suggestions
   * @returns {void}
   */
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

  /**
   * Toggles audio on and off, displaying the correct button (play or pause)
   * @returns {void}
   */
  function toggleAudio() {
    const audioButton = document.querySelector(".audio-button");
    if (player.src.includes("mp3")) {
      if (player.paused) {
        player.play();
        audioButton.classList.remove("play-button");
        audioButton.classList.add("pause-button");
        audioButton.style.cursor = "default";
        setTimeout(() => {
          player.pause();
          audioButton.classList.remove("pause-button");
          audioButton.classList.add("play-button");
          audioButton.style.cursor = "pointer";
          player.currentTime = 0;
        }, trackAvailableSeconds*1000)
      }
    } else {
      pickRandomSong();
    }
  }

  return (
    <div>
      <img width={"15%"} src={props.chosenPlaylist.images[0].url} alt={props.chosenPlaylist.name} />
      <h5>{props.chosenPlaylist.name}</h5>
      {!hasStarted && <button onClick={pickRandomSong}>Click here to start</button>}
      {hasStarted &&
        <div>
          <div className="audio-buttons">
            <div onClick={toggleAudio} className="audio-button play-button">
            </div>
          </div>

          <div className="autosuggest_wrapper">
            <input
              type="text"
              id="guess"
              className="userGuess"
              placeholder="Guess song title"
              onKeyUp={generateSuggestions}
            />
            <ul className="suggestionList_scrollable">{renderSuggestions()}</ul>
          </div>
          <button onClick={checkAnswer}>Submit</button>
        </div>
      }
    </div>
  );
}