import { useState, useEffect, useRef } from 'react';
import { catchErrors } from '../utils';
import { BASE_URL, OPTIONS } from "../spotify";
import Playlist from './Playlist';
import "./PlaylistSelectionStep.css";

/**
 * Component that encloses the playlist selection phase of the game
 * @param {Object} props 
 * @returns {JSX.Element}
 */
export default function PlaylistSelectionStep({
  currentStep,
  setCurrentStep,
  setChosenPlaylist,
  setTracks,
  playlists,
}) {
  const [tracksData, setTracksData] = useState(null);
  const [loading, setLoading] = useState(false);
  const currFetchCycle = useRef(1);

  /**
   * Makes a call to the Spotify Web API to fetch the tracks of the playlist with playlistId
   * @param {string} playlistId - The ID of the selected playlist
   */
  async function choosePlaylist(playlistId) {
    const res = await fetch(`${BASE_URL}/playlists/${playlistId}`, OPTIONS);
    const playlist = await res.json();

    setChosenPlaylist(playlist);
    setTracks(playlist.tracks.items); // makes us get a 100 extra songs, to fix
    setTracksData(playlist.tracks);

    // setCurrentStep(2); // wrap in conditional
  }

  // Fetches all the chosen playlist's tracks
  useEffect(() => {
    const n_fetchCycles = tracksData ? Math.ceil(tracksData.total / 100) : 10;
    if (currFetchCycle.current % n_fetchCycles === 0) {
      currFetchCycle.current = 0;
      setLoading(false);
      setCurrentStep(2);
    }

    if (!tracksData) {
      return;
    }

    /**
     * Makes another call to the Spotify Web API to get the playlist's tracks
     * while there are still are tracks to be fetched
     * @returns {Promise}
     */
    async function fetchMoreTracks() {
      if (tracksData.next) {
        setLoading(true);
        const res = await fetch(tracksData.next, OPTIONS);
        const playlist = await res.json();
        setTracksData(playlist);
      }
    }

    for (let i = 0; i < tracksData.items.length; i++) {
      setTracks((tracks) => [
        ...(tracks ? tracks : []),
        tracksData.items[i],
      ]);
    }

    currFetchCycle.current++;
    catchErrors(fetchMoreTracks());
  }, [tracksData]);

  if (currentStep !== 1) {
    return null;
  }

  /**
   * Renders all playlist covers and their titles
   * @returns {void}
   */
  function renderPlaylists() {
    if (playlists) {
      // move this back to a one-step return:
      return playlists.map((playlist) => (
        <div className="playlist" key={playlist.id}>
          {/* <img
            // width={"80%"}
            src={playlist.images[0].url}
            alt={playlist.name}
            onClick={() => catchErrors(choosePlaylist(playlist.id))}
          />
          <p>{playlist.name}</p> */}
          <Playlist 
            src={playlist.images[0].url}
            alt={playlist.name}
            onClick={() => catchErrors(choosePlaylist(playlist.id))}
          />
        </div>
      ));
      // return renderedPlaylists;
    }
  }

  return (
    <div className="PlaylistSelectionStep">
      {loading ? (
        <div className="loading-container">
          <div className="loading-icon"></div>
          <h4 className="fetching-tracks">Fetching tracks...</h4>
        </div>
      ) : (
        <div className="playlists">{renderPlaylists()}</div>
      )}
    </div>
  );
}