

export default function ResultsStep(props) {
  if (props.currentStep !== 3) {
    return null;
  }

  // console.log(props.chosenPlaylist);
  // console.log(props.currentQuizTrack);

  var artistNames = props.currentQuizTrack.artists.map(a => a.name).join(", ");

  return (
    <div>
      <h3>Results</h3>
      {props.correctAnswer
      ? <h5>Congratulations!</h5>
      : <h5>Too bad, try again next time!</h5>}

      {/* <img width={"15%"} src={props.chosenPlaylist.images[0].url} alt={props.chosenPlaylist.name} />
      <h5>Playlist chosen: {props.chosenPlaylist.name}</h5> */}

      <img width={"15%"} src={props.currentQuizTrack.album.images[0].url} alt={props.currentQuizTrack.album.name + " album cover"} />
      <h5>
        Correct answer: 
        <a href={props.currentQuizTrack.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          {props.currentQuizTrack.name} by {artistNames} ({props.currentQuizTrack.album.release_date.slice(0, 4)})
        </a>
      </h5>
      <h5>
        From the playlist: 
        <a href={props.chosenPlaylist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          {props.chosenPlaylist.name}
        </a>
      </h5>

      <button onClick={() => props.setCurrentStep(1)}>Play with another playlist</button>
      <button onClick={() => props.setCurrentStep(2)}>Play with same playlist</button>
      <button onClick={() => console.log(props.score)}>See stats</button>

    </div>
  );
}