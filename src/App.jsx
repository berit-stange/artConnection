import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firestore";
import ArtworkCard from "./components/ArtworkCard";

function App() {
  const [artworks, setArtworks] = useState([]);

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

  return (
    <main>
      <h1>artConnection</h1>

      <div className="artwork-grid">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </main>
  );
}

export default App;