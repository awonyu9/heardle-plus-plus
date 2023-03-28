import Playlist from "./Playlist";
import "./ResultsStep.css";

/**
 * Component that encloses the results phase of the game
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function ResultsStep({
  currentStep,
  setCurrentStep,
  correctAnswer,
  currentQuizTrack,
  chosenPlaylist,
  // score,
}) {
  if (currentStep !== 3) {
    return null;
  }

  var artistNames = currentQuizTrack.artists.map((a) => a.name).join(", ");

  /**
   * Shows or hides the overlay box
   * @returns {void}
   */
  function toggleOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay.style.display === "block") {
      overlay.style.display = "none";
    } else {
      overlay.style.display = "block";
    }
  }

  return (
    <div className="ResultsStep">
      <div className="playlist-message">
        <Playlist
          src={chosenPlaylist.images[0].url}
          alt={chosenPlaylist.name}
        />
        <div className="message">
          <h2>YOUR RESULTS</h2>
          {correctAnswer ? (
            <h5>Congratulations!</h5>
          ) : (
            <h5>Too bad, feel free to try again!</h5>
          )}
        </div>
      </div>

      {/* <div className="">
        <img
          className="playlist-cover"
          // width={"80%"}
          src={chosenPlaylist.images[0].url}
          alt={chosenPlaylist.name}
          // onClick={() => catchErrors(choosePlaylist(playlist.id))}
        />
        <p>{chosenPlaylist.name}</p>
      </div> */}

      <div className="track-info">
        <div className="title-artist-year">
          <h5 className="title">{currentQuizTrack.name}</h5>
          <h5 className="artist-year">{artistNames} ・ {currentQuizTrack.album.release_date.slice(0, 4)}</h5>
        </div>
        <img
          src={currentQuizTrack.album.images[0].url}
          alt={currentQuizTrack.album.name + " album cover"}
        />
      </div>

      {/* <img
        className="track-cover"
        // width={"15%"}
        src={currentQuizTrack.album.images[0].url}
        alt={currentQuizTrack.album.name + " album cover"}
      />
      <h5>
        Correct answer:
        <a
          href={currentQuizTrack.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          {currentQuizTrack.name} by {artistNames} (
          {currentQuizTrack.album.release_date.slice(0, 4)})
        </a>
      </h5>
      <h5>
        From the playlist:
        <a
          href={chosenPlaylist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          {chosenPlaylist.name}
        </a>
      </h5> */}

      {/* <hr /> */}
      <h3 className="play-again-heading">Play again</h3>
      <div className="buttons-container">
        <button className="another-playlist" onClick={() => setCurrentStep(1)}>
          Another playlist
        </button>
        <button className="same-playlist" onClick={() => setCurrentStep(2)}>
          Same playlist
        </button>
      </div>
      {/* <button onClick={toggleOverlay}>See stats</button>
      <div className="overlay" onClick={toggleOverlay}>
        <div className="overlay-text">
          Your current score is: {score}
        </div>
      </div> */}
      {/* score card should be its own component */}
    </div>
  );
}