// import LoginStep from "./LoginStep"
import "./Header.css";
import { logout } from "../spotify"
import { useCallback, useEffect } from "react";

/**
 * Component that ...
 * @returns {JSX.Element}
 */
export default function Header({ token, setCurrentStep }) {
  /**
   * Changes colour theme of the app to the next theme in the themes array
   * @returns {void}
   */
  const toggleTheme = useCallback(() => {
    const themes = ["var(--heardle-plus-plus-pink)", "var(--heardle-plus-plus-blue)", "var(--heardle-plus-plus-yellow)"];
    const root = document.querySelector(":root");
    const header = document.querySelector(".Header");
    const currColor = root.style.backgroundColor;
    const currIndex = themes.indexOf(currColor);
    root.style.backgroundColor = themes[(currIndex+1) % themes.length];
    header.style.backgroundColor = themes[(currIndex+1) % themes.length];
  }, [])

  useEffect(() => {
    function handleKeydown(e) {
      if (e.key === "t") {
        toggleTheme();
      }
    }
    window.addEventListener("keydown", handleKeydown);
  }, [toggleTheme]);

  return (
    <header className="Header">
      <h1>Heardle++</h1>
      {!token ?
          <button><a href="http://localhost:8888/login">Log in
              to Spotify</a></button>
          : <button onClick={logout} className="logout">Log out</button>
      }
      <button onClick={toggleTheme} title="Press T">Toggle theme</button>
      {/* <h4 style={{color: 'red'}}>Pro tip: Always refresh the page to see if an update is really working</h4> */}
      <hr />
    </header>
  )
}