import { useState } from "react";
import Playlist from "./Playlist";
import "./GuessingStep.css";
import Autocomplete from "react-autocomplete";

/**
 * Component that encloses the guessing phase of the game
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function GuessingStep({
  currentStep,
  setCurrentStep,
  setGuess,
  currentTrack,
  setTrack,
  setIsGuessCorrect,
  chosenPlaylist,
  tracks,
  player,
  setScore,
}) {
  const [inputValue, setInputValue] = useState("");

  const trackAvailableSeconds = 3;
  // const player = player;
  var chosenPlaylistTrackNames = [];
  var currPlayableTracks = tracks;

  if (currPlayableTracks) {
    for (let i = 0; i < currPlayableTracks.length; i++) {
      chosenPlaylistTrackNames.push(currPlayableTracks[i].track.name);
    }
    chosenPlaylistTrackNames = [...new Set(chosenPlaylistTrackNames)];
  }

  const [hasStarted, setHasStarted] = useState(false);

  if (currentStep !== 2) {
    return null;
  }

  /**
   * Generates a random number and indexes list of playlist tracks,
   * sets currentTrack to that track's title,
   * and loads HTMLAudioElement with the track's preview URL
   * @returns {void}
   */
  function pickRandomSong() {
    setGuess(null);
    setInputValue("");

    var randomIndex = Math.floor(Math.random() * currPlayableTracks.length);
    const randomTrack = currPlayableTracks[randomIndex].track;
    console.log("answer:", randomTrack.name);
    setTrack(randomTrack);

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
    // const userGuess = document.getElementById("guess").value.toLowerCase();
    const userGuess = inputValue.toLowerCase();
    const correctAnswer = currentTrack.name.toLowerCase();

    // console.log("answer:", correctAnswer);

    setGuess(userGuess ? userGuess : " ");
    setIsGuessCorrect(userGuess === correctAnswer);
    if (userGuess === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setHasStarted(false);
    setCurrentStep(3);
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
        }, trackAvailableSeconds * 1000);
      }
    } else {
      pickRandomSong();
    }
  }

  return (
    <div className="GuessingStep">
      
      <Playlist 
        src={chosenPlaylist.images[0].url}
        alt={chosenPlaylist.name}
      />
      
      {!hasStarted && (
        <button onClick={pickRandomSong}>Click here to start</button>
      )}
      {hasStarted && (
        <div>
          <div className="audio-buttons">
            <div
              onClick={toggleAudio}
              className="audio-button play-button"
            ></div>
          </div>

          <div className="autocomplete">
            <Autocomplete
              items={chosenPlaylistTrackNames}
              shouldItemRender={(item, value) => (
                item.toLowerCase().indexOf(value.toLowerCase()) > -1
                && value !== ""
              )}
              getItemValue={item => item}
              renderItem={(item, isHighlighted) => (
                <div key={item} className={isHighlighted ? "suggestion selected" : "suggestion no-selected"}>
                  {item}
                </div>
              )}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSelect={(value) => setInputValue(value)}
              inputProps={{
                placeholder: "Guess the song title here",
                className:"input"
              }}
              renderMenu={items => (
                <div className="menu" children={items} />
              )}
            />
          </div>

          <button className="submit" onClick={checkAnswer}>Submit song title</button>
        </div>
      )}
    </div>
  );
}