import { logout } from '../spotify';

/**
 * Component that encloses the login phase of the game
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function LoginStep(props) {
  return (
    <div>
      {!props.token ?
          <button><a href="http://localhost:8888/login">Log in
              to Spotify</a></button>
          : <button onClick={logout} className="logout">Log out</button>
      }
    </div>
  );
}