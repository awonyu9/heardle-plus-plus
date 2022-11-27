import { useState, useEffect, useRef } from 'react';
import { catchErrors } from '../utils';
import { BASE_URL, OPTIONS } from "../spotify";

export default function PlaylistSelectionStep(props) {
  // const [currOffset, setCurrOffset] = useState(1);
  const [tracksData, setTracksData] = useState(null);
  const [loading, setLoading] = useState(false);
  const currFetchCycle = useRef(1);
  
  async function choosePlaylist(playlistId) { // this is probably where we wanna save visited playlists
    const res = await fetch(`${BASE_URL}/playlists/${playlistId}`, OPTIONS);
    const playlist = await res.json();
    
    props.setChosenPlaylist(playlist);
    props.setTracks(playlist.tracks.items); // makes us get a 100 extra songs, leave it for demo
    setTracksData(playlist.tracks);

    // props.setCurrentStep(2); // wrap in conditional
  }

  useEffect(() => {
    const n_fetchCycles = tracksData ? Math.ceil(tracksData.total / 100) : 10;
    // console.log(currFetchCycle.current, n_fetchCycles, currFetchCycle === n_fetchCycles);
    if (currFetchCycle.current % n_fetchCycles === 0) {
      currFetchCycle.current = 0;
      setLoading(false);
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
        setLoading(true);
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

  function renderPlaylists() { // move this back to a one-step return
    if (props.playlists) {
      var renderedPlaylists = props.playlists.map((playlist) => (
        <div className="playlist" key={playlist.id}> 
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
      {
        loading ?
        <div>
          <div class="loading-icon"></div>
          <p>Fetching tracks...</p>
        </div>
        : <div className="playlists">{renderPlaylists()}</div>
      }
    </div>
  );
}