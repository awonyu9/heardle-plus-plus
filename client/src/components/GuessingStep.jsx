import Player from './Player';

export default function GuessingStep(props) {
  // if (props.currentStep !== 3) {
  //   return null;
  // }
  console.log("on guessing step, passed tracks:", props.tracks);

  return (
    <div>
      <p>Guessing step placeholder</p>
      <Player tracks={props.tracks} />
      <hr />
    </div>
  );
}