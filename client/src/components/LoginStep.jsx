import { logout } from '../spotify';

export default function LoginStep(props) {
  // if (props.currentStep !== 1) {
  //   return null;
  // }

  return (
    <div>
      <p>Login step placeholder</p>
      {!props.token ?
          <button><a href="http://localhost:8888/login">Log in
              to Spotify</a></button>
          : <button onClick={logout} className="logout">Log out</button>}

      {/* {props.token && props.moveOn(2)} */}
      <hr />

    </div>
  );
}