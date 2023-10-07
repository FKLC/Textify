import { useContext, useState } from 'react';

import Navbar from './components/Navbar';
import AccordionItem from './components/AccordionItem';

import TextInput from './components/TextInput';
import PlaylistPreview from './components/PlaylistPreview';

import { AuthContext } from './providers/AuthProvider';
import { APIContext } from './providers/APIProvider';

import levenshtein from 'js-levenshtein';


export default function App() {
  const auth = useContext(AuthContext);
  const api = useContext(APIContext);

  const [createdPlaylist, setCreatedPlaylist] = useState([]);

  const generatePlaylist = async (text) => {
    const words = text.split(",").map(word => word.trim());
    const playlist = [];
    for (const word of words) {
      const tracks = await api.spotify.searchTracks(word);
      const distances = tracks.reduce((acc, track) => {
        acc[track.id] = levenshtein(word, track.name);
        return acc;
      }, {});
      const tracksSorted = tracks.sort((a, b) => distances[a.id] - distances[b.id]);
      playlist.push(tracksSorted);
    }
    setCreatedPlaylist(playlist);
  }

  const content = auth.accessKey == null ?
    <h2>Not logged in. Please login first to use the app.</h2>
    : <div className="accordion">
      <AccordionItem title="Enter Your Text">
        <TextInput onSubmit={generatePlaylist} />
      </AccordionItem>
      <AccordionItem title="Preview Generated Playlist">
        <PlaylistPreview playlist={createdPlaylist} />
      </AccordionItem>
    </div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h4 style={{ textAlign: "center" }}>Create a playlist with songs that make up your text</h4>
        {content}
      </div>
    </>
  )
}
