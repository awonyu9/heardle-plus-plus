

export default function ResultsStep(props) {
  if (props.currentStep !== 3) {
    return null;
  }

  // console.log(props.chosenPlaylist);
  // console.log(props.currentQuizTrack);

  return (
    <div>
      <h3>Results</h3>
      {props.correctAnswer
      ? <h5>Congratulations!</h5>
      : <h5>Too bad, try again next time!</h5>}

      {/* <img width={"15%"} src={props.chosenPlaylist.images[0].url} alt={props.chosenPlaylist.name} />
      <h5>Playlist chosen: {props.chosenPlaylist.name}</h5> */}

      <img width={"10%"} src={props.currentQuizTrack.album.images[0].url} alt={props.currentQuizTrack.album.name} />
      <h5>
        <a href={props.currentQuizTrack.external_urls.spotify}>
          Correct answer: {props.currentQuizTrack.name} by {props.currentQuizTrack.artists[0].name}
        </a>
      </h5>

      <button onClick={() => props.setCurrentStep(1)}>Play with another playlist</button>
      <button onClick={() => props.setCurrentStep(2)}>Play with same playlist</button>

    </div>
  );
}