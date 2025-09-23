import "./css/NoteItem.css";

function NoteItem({ note, deleteNote, startEditNote, toggleFavorite, confirmDelete }) {
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
        <button className="delete-btn" onClick={() => confirmDelete(note.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;