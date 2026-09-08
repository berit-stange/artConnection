import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function importArtwork(objectId) {
  const response = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
  );

  if (!response.ok) {
    throw new Error(`The Met API Fehler: ${response.status}`);
  }

  const data = await response.json();

  // Nur Werke mit Bild importieren
  if (!data.primaryImage) {
    return false;
  }

  const artworkData = {
    source: "met",
    sourceId: String(data.objectID),
    title: data.title || "",
    artistName: data.artistDisplayName || "",
    dateDisplay: data.objectDate || "",
    medium: data.medium || "",
    imageUrl: data.primaryImage,
    isPublicDomain: data.isPublicDomain || false,
  };

  await db
    .collection("artworks")
    .doc(`met-${data.objectID}`)
    .set(artworkData);

  console.log(`Importiert: ${data.title}`);

  return true;
}

async function importArtworks() {
  // Suche nach Gemälden mit öffentlichen Bildern
  const searchUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/search" +
    "?q=painting&hasImages=true&isPublicDomain=true";

  const response = await fetch(searchUrl);

  if (!response.ok) {
    throw new Error(`The Met Search Fehler: ${response.status}`);
  }

  const searchData = await response.json();

  console.log(`The Met gefunden: ${searchData.total} Werke`);

  let imported = 0;

  for (const objectId of searchData.objectIDs) {
    if (imported >= 5) {
      break;
    }

    try {
      const success = await importArtwork(objectId);

      if (success) {
        imported++;
      }
    } catch (error) {
      console.error(`Fehler bei Objekt ${objectId}:`, error);
    }
  }

  console.log(`\nFertig. ${imported} Werke importiert.`);
}

importArtworks();