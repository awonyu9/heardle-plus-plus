import { useState, useEffect } from "react";
import { getUserPlaylists } from "../spotify";
import { catchErrors } from "../utils";


export default function Playlists(props) {
  const [playlists, setPlaylists] = useState(null);
  // const [chosenPlaylistId, setChosenPlaylistId] = useState(null);
  
  useEffect(() => {

    async function fetchData() {
      const fetchedPlaylists = await getUserPlaylists(3, 15);
      setPlaylists(fetchedPlaylists.items);
      // console.log("from within component: ", playlists);
      };

    catchErrors(fetchData());
  }, [])

  return (
    <div>
      <h3>Playlists: </h3>
        {playlists &&
          <div className="playlists">
            {renderPlaylists(playlists)}
          </div>
        }

    </div>
  )
}

function renderPlaylists(playlists) {
  // console.log("from function", playlists[0].id);

  return playlists.map(playlist => (
    <div className="playlist">
      <img width={"35%"} src={playlist.images[0].url} alt={playlist.name} />
      <p>
        {/* <a href={`http://localhost:8888/choose_playlist?playlist_id=${playlist.id}`}> */}
          {playlist.name}
        {/* </a> */}
      </p>
    </div>
  ))
}