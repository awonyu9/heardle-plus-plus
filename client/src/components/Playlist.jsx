import "./Playlist.css";

export default function Playlist({ src, alt, onClick }) {
  return (
    <div className="Playlist" onClick={onClick}>
      <img
        src={src}
        alt={alt}
      />
      <h4>{alt}</h4>
    </div>
  )
}