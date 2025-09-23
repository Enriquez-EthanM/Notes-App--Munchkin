import NoteList from "../components/NoteList";
import "./css/Favorites.css";

function Favorites({ notes, deleteNote, startEditNote, toggleFavorite }) {
  const favorites = notes.filter(n => n.favorite && !n.deletedAt);
  return (
    <div className="favorites-page">
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p className="empty">No favorites yet. Tap the ★ on a note.</p>
      ) : (
        <NoteList
          notes={favorites}
          deleteNote={deleteNote}
          startEditNote={startEditNote}
          toggleFavorite={toggleFavorite}
          context="favorites"
        />
      )}
    </div>
  );
}

export default Favorites; 