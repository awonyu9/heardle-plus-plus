// import { useEffect } from 'react';
// import { getPlaylist } from '../spotify';
// import { catchErrors } from '../utils';
import Playlists from './Playlists';

export default function PlaylistSelectionStep(props) {
  // if (props.currentStep !== 2) {
  //   return null;
  // }

  // useEffect(() => {
  //   async function fetchData() {
  //     const playlist = await getPlaylist();
  //     const tracks = playlist.tracks.items;
  //     // console.log("tracks:", tracks);s
  //     props.setTracks(tracks);
  //   }
  //   catchErrors(fetchData());
  // }, [])

  return (
    <div>
      <p>Playlist selection step placeholder</p>
      <Playlists />
      <hr />
    </div>
  );
}