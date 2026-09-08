function ArtworkCard({ artwork }) {
  return (
    <article className="artwork-card">
      {artwork.imageUrl && (
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="artwork-card-image"
        />
      )}

      <div className="artwork-card-content">
        <h2>{artwork.title}</h2>

        <p>{artwork.artistName}</p>

        <p>{artwork.dateDisplay}</p>
      </div>
    </article>
  );
}

export default ArtworkCard;