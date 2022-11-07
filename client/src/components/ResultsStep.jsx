

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
        Correct answer: 
        <a href={props.currentQuizTrack.external_urls.spotify}>
          {props.currentQuizTrack.name} by {props.currentQuizTrack.artists[0].name} ({props.currentQuizTrack.album.release_date.slice(0, 4)})
        </a>
      </h5>

      <button onClick={() => props.setCurrentStep(1)}>Play with another playlist</button>
      <button onClick={() => props.setCurrentStep(2)}>Play with same playlist</button>
      <button>See stats</button>

    </div>
  );
}