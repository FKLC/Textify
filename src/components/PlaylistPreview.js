import { useContext, useEffect, useState } from "react"
import { APIContext } from "../providers/APIProvider"


export default function PlaylistPreview({ playlist }) {
  const api = useContext(APIContext);

  const [selectedTracks, setSelectedTracks] = useState([]);
  useEffect(() => {
    setSelectedTracks(
      playlist.map(tracks => tracks[0].id)
    );
  }, [playlist]);

  const updateSelectedTracks = (i, track) => {
    setSelectedTracks([
      ...selectedTracks.slice(0, i),
      track,
      ...selectedTracks.slice(i + 1)
    ]);
  }

  const [loading, setLoading] = useState(false);
  const createPlaylist = async () => {
    setLoading(true);
    const playlistId = await api.spotify.createPlaylist("Textify Playlist");
    await api.spotify.addTracksToPlaylist(playlistId, selectedTracks);
    window.open("https://open.spotify.com/playlist/" + playlistId, "_blank");
    setLoading(false);
  }

  return (
    <>
      <h4>Tracks</h4>
      <div className="list-group">
        {
          playlist.map((tracks, i) => (
            <li
              className="list-group-item"
              key={JSON.stringify(tracks)}
            >
              <select 
                className="form-select"
                value={selectedTracks[i]?.id}
                onChange={(e) => updateSelectedTracks(i, e.target.value)}
              >
                {
                  tracks.map(track => (
                    <option key={track.id} value={track.id}>{track.name}</option>
                  ))
                }
              </select>
            </li>
          ))
        }
        <li className="list-group-item">
          <button className="btn btn-primary w-100" onClick={createPlaylist} disabled={loading || !selectedTracks.length}>
            Create Playlist!
          </button>
        </li>
      </div>

    </>
  )
}