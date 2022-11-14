// import { useEffect } from 'react';
// import { getPlaylist } from '../spotify';
import { catchErrors } from '../utils';
// import Playlists from './Playlists';
import { BASE_URL, OPTIONS } from "../spotify";

export default function PlaylistSelectionStep(props) {
  if (props.currentStep !== 1) {
    return null;
  }

  

  async function choosePlaylist(playlistId) {
    const res = await fetch(`${BASE_URL}/playlists/${playlistId}`, OPTIONS);
    const playlist = await res.json();
    props.setChosenPlaylist(playlist);
    props.setTracks(playlist.tracks.items);

    props.setCurrentStep(2);
  }

  function renderPlaylists() {
    if (props.playlists) {
      return props.playlists.map(playlist => (
        <div className="playlist" key={playlist.id}>
          <img
            width={"35%"}
            src={playlist.images[0].url}
            alt={playlist.name}
            onClick={() => catchErrors(choosePlaylist(playlist.id))} />
          <p>{playlist.name}</p>
        </div>
      ))
    }
  }

  return (
    <div>
      <div className="playlists">{renderPlaylists()}</div>
    </div>
  );
}