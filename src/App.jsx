import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firestore";
import ArtworkCard from "./components/ArtworkCard";
import SearchInput from "./components/SearchInput";

function App() {
  const [artworks, setArtworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadArtworks() {
      try {
        const snapshot = await getDocs(collection(db, "artworks"));

        const artworksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArtworks(artworksData);
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      }
    }

    loadArtworks();
  }, []);

  const filteredArtworks = artworks.filter((artwork) => {
    const search = searchTerm.toLowerCase();

    return (
      artwork.title?.toLowerCase().includes(search) ||
      artwork.artistName?.toLowerCase().includes(search)
    );
  });

  return (
    <main>
      <h1>artConnection</h1>


      <SearchInput
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />
      

      <div className="artwork-grid">
        {filteredArtworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
        />
      ))}
      </div>
    </main>
  );
}

export default App;