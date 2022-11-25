import { useState, useEffect, useRef } from 'react';
// import { getPlaylist } from '../spotify';
import { catchErrors } from '../utils';
// import Playlists from './Playlists';
import { BASE_URL, OPTIONS } from "../spotify";

export default function PlaylistSelectionStep(props) {
  // const [currOffset, setCurrOffset] = useState(1);
  const [tracksData, setTracksData] = useState(null);
  // var currFetchCycle = 1;
  const currFetchCycle = useRef(1);
  // console.log(fetchCycles);

  // const amountOfPlaylistsShown = 4;
  
  async function choosePlaylist(playlistId) {
    const res = await fetch(`${BASE_URL}/playlists/${playlistId}`, OPTIONS);
    const playlist = await res.json();
    
    props.setChosenPlaylist(playlist);
    props.setTracks(playlist.tracks.items);
    setTracksData(playlist.tracks);

    // props.setCurrentStep(2); // wrap in conditional
  }

  useEffect(() => {
    const n_fetchCycles = tracksData ? Math.ceil(tracksData.total / 100) : 10;
    console.log(currFetchCycle.current, n_fetchCycles, currFetchCycle === n_fetchCycles);
    if (currFetchCycle.current % n_fetchCycles === 0) {
      currFetchCycle.current = 0;
      props.setCurrentStep(2);
    }
    if (!tracksData) {
      // props.setCurrentStep(2);
      // return() => {
      //   currFetchCycle.current = 1;
      // }
      return;
    }

    // console.log(tracksData);

    async function fetchMoreTracks() {
      if (tracksData.next) {
        const res = await fetch(tracksData.next, OPTIONS);
        const playlist = await res.json();
        setTracksData(playlist);
      }
    }

    for (let i = 0; i < tracksData.items.length; i++) {
      // console.log(tracksData.items[i]);
      props.setTracks(tracks => [...tracks ? tracks : [], tracksData.items[i]]);
    }

    // props.setTracks(tracksData.items);
    // console.log(typeof(Object.values(tracksData.items)))

    // props.setTracks(tracks => [...tracks, tracksData.items]);

    currFetchCycle.current++;
    catchErrors(fetchMoreTracks());

  }, [tracksData])

  if (props.currentStep !== 1) {
    return null;
  }

  function renderPlaylists() {
    if (props.playlists) {
      var renderedPlaylists = props.playlists.map((playlist, i) => (
        <div className="playlist" key={i}> 
        {/* should be <div className="playlist" key={playlist.id}> once I fix duplicate problem */}
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
        {/* {currOffset > amountOfPlaylistsShown && 
          <button className="navButton" onClick={() => setCurrOffset(curr => curr - amountOfPlaylistsShown)}>
            {"<"}
          </button>}
        {currOffset <= props.playlists.length - amountOfPlaylistsShown &&
          <button className="navButton" onClick={() => setCurrOffset(curr => curr + amountOfPlaylistsShown)}>
            {">"}
          </button>} */}
    </div>
  );
}