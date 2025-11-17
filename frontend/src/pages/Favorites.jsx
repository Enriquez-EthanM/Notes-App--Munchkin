import NoteList from "../components/NoteList";
import { useNavigate } from "react-router-dom";
import "./css/Favorites.css";

function Favorites({ notes, deleteNote, startEditNote, toggleFavorite }) {
  const navigate = useNavigate();
  const favorites = notes.filter(n => n.favorite);
  
  const handleEditNote = (note) => {
    startEditNote(note);
    navigate('/notes');
  };
  
  return (
    <div className="favorites-page">
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p className="empty">No favorites yet. Tap the ★ on a note.</p>
      ) : (
        <NoteList
          notes={favorites}
          deleteNote={deleteNote}
          startEditNote={handleEditNote}
          toggleFavorite={toggleFavorite}
          context="favorites"
        />
      )}
    </div>
  );
}

export default Favorites; 