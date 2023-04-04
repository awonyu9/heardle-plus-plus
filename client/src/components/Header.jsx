// import LoginStep from "./LoginStep"
import "./Header.css";
import { logout } from "../spotify"

/**
 * Component that ...
 * @returns {JSX.Element}
 */
export default function Header({ token, setCurrentStep }) {
  /**
   * Changes colour theme of the app to the next theme in the themes array
   * @returns {void}
   */
  const themes = ["var(--heardle-plus-plus-pink)", "var(--heardle-plus-plus-blue)", "var(--heardle-plus-plus-yellow)"];
  function toggleTheme() {
    const root = document.querySelector(":root");
    const header = document.querySelector(".Header");
    const currColor = root.style.backgroundColor;
    const currIndex = themes.indexOf(currColor);
    root.style.backgroundColor = themes[(currIndex+1) % themes.length];
    header.style.backgroundColor = themes[(currIndex+1) % themes.length];
  }

  return (
    <header className="Header">
      <h1>Heardle++</h1>
      {!token ?
          <button><a href="http://localhost:8888/login">Log in
              to Spotify</a></button>
          : <button onClick={logout} className="logout">Log out</button>
      }
      <button onClick={toggleTheme}>Toggle theme</button>
      {/* <h4 style={{color: 'red'}}>Pro tip: Always refresh the page to see if an update is really working</h4> */}
      <hr />
    </header>
  )
}