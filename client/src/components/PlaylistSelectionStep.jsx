// import { useEffect } from 'react';
// import { getPlaylist } from '../spotify';
// import { catchErrors } from '../utils';
// import Playlists from './Playlists';

export default function PlaylistSelectionStep(props) {
  // if (props.currentStep !== 2) {
  //   return null;
  // }

  

  async function choosePlaylist(playlistId) {
    // const playlistId = "37i9dQZF1EVJSvZp5AOML2";
    // var rn = Math.floor(Math.random() * playlists.length);
    // var playlistId = playlists[rn].id;
    const BASE_URL = "https://api.spotify.com/v1";
    const OPTIONS = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${props.accessToken}`,
      }
    }

    try {
      const res = await fetch(`${BASE_URL}/playlists/${playlistId}`, OPTIONS);
      const playlist = await res.json();
      props.setChosenPlaylist(playlist);
      props.setTracks(playlist.tracks.items);
    } catch (error) {
      console.log(error);
    }
  }

  function renderPlaylists() {
    if (props.playlists) {
      return props.playlists.map(playlist => (
        <div className="playlist" key={playlist.id}>
          <img
            width={"35%"}
            src={playlist.images[0].url}
            alt={playlist.name}
            onClick={() => props.catchErrors(choosePlaylist(playlist.id))} />
          <p>{playlist.name}</p>
        </div>
      ))
    }
  }

  return (
    <div>
      
      <div className="playlists">{renderPlaylists()}</div>
      <hr />
    </div>
  );
}