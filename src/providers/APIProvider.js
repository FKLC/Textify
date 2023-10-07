import { createContext, useContext, useState } from "react"
import { AuthContext } from "./AuthProvider";


const defaultContext = {
  spotify: null,
};
export const APIContext = createContext(defaultContext);

export default function APIProvider({ children }) {
  const auth = useContext(AuthContext);
  const [context, setContext] = useState(defaultContext);

  if (auth.accessKey && context.spotify == null) {
    setContext({
      ...context,
      spotify: new SpotifyAPI(auth.accessKey),
    });
  }

  return (
    <APIContext.Provider value={context}>
      {children}
    </APIContext.Provider>
  )
}

class SpotifyAPI {
  constructor(token) {
    this.token = token;
  }

  async getId() {
    return fetch(
      "https://api.spotify.com/v1/me",
      { headers: { authorization: this.token } }
    )
      .then((response) => response.json())
      .then((response) => response.id);
  }

  async createPlaylist(name) {
    const userId = await this.getId();

    return fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: { authorization: this.token },
        body: JSON.stringify({
          name,
          public: false
        }),
        method: "POST",
      },
    )
      .then((response) => response.json())
      .then((response) => response.id);
  }

  async addTracksToPlaylist(playlistId, trackIds) {
    const chunks = trackIds.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 100);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);

    let ids = [];
    while ((ids = chunks.pop())) {
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { authorization: this.token },
          body: JSON.stringify({ uris: ids.map((id) => `spotify:track:${id}`) }),
          method: "POST",
        }
      ).then((response) => response.json())
    }
  }

  async searchTracks(query) {
    return fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      { headers: { authorization: this.token } }
    )
      .then((response) => response.json())
      .then((response) => response.tracks.items);
  }
}