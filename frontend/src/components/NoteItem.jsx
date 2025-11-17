import "./css/NoteItem.css";

function NoteItem({ note, deleteNote, startEditNote, toggleFavorite, permanentDelete }) {
  const handleDelete = () => {
    const choice = window.confirm('Choose OK to move to trash, or Cancel to delete permanently.');
    if (choice) {
      // OK clicked - move to trash
      deleteNote(note.id);
    } else {
      // Cancel clicked - ask for permanent delete confirmation
      const confirmPermanent = window.confirm('Are you sure you want to delete this note permanently? This cannot be undone.');
      if (confirmPermanent && permanentDelete) {
        permanentDelete(note.id);
      }
    }
  };
  
  return (
    <div className="note-item">
      <div className="note-content">
        <h3 className="note-title">{note.title}</h3>
        <p className="note-text">{note.content}</p>
      </div>
      <div>
        <button className="edit-btn" onClick={() => startEditNote(note)}>
          Edit
        </button>
        <button className="fav-btn" onClick={() => toggleFavorite(note.id)} title={note.favorite ? "Unfavorite" : "Favorite"}>
          {note.favorite ? "★" : "☆"}
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;