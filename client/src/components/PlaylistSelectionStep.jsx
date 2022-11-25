import { useState } from 'react';
// import { getPlaylist } from '../spotify';
import { catchErrors } from '../utils';
// import Playlists from './Playlists';
import { BASE_URL, OPTIONS } from "../spotify";

export default function PlaylistSelectionStep(props) {
  const [currOffset, setCurrOffset] = useState(1);

  if (props.currentStep !== 1) {
    return null;
  }

  const amountOfPlaylistsShown = 4;
  

  async function choosePlaylist(playlistId) {
    const res = await fetch(`${BASE_URL}/playlists/${playlistId}`, OPTIONS);
    const playlist = await res.json();
    props.setChosenPlaylist(playlist);
    props.setTracks(playlist.tracks.items);

    props.setCurrentStep(2);
  }

  function renderPlaylists() {
    if (props.playlists) {
      var renderedPlaylists = props.playlists.slice(currOffset, currOffset+amountOfPlaylistsShown).map(playlist => (
        <div className="playlist" key={playlist.id}>
          <img
            width={"80%"}
            src={playlist.images[0].url}
            alt={playlist.name}
            onClick={() => catchErrors(choosePlaylist(playlist.id))}
          />
          <p>{playlist.name}</p>
        </div>
      ))
      // setCurrOffset(currOffset+3);
      return renderedPlaylists;
    }
  }

  return (
    <div>
      <div className="playlists">{renderPlaylists()}</div>
        {currOffset > amountOfPlaylistsShown && 
          <button className="navButton" onClick={() => setCurrOffset(curr => curr - amountOfPlaylistsShown)}>
            {"<"}
          </button>}
        {currOffset <= props.playlists.length - amountOfPlaylistsShown &&
          <button className="navButton" onClick={() => setCurrOffset(curr => curr + amountOfPlaylistsShown)}>
            {">"}
          </button>}
    </div>
  );
}