import "./css/NoteItem.css";

function NoteItem({ note, deleteNote }) {
  return (
    <div className="note-item">
      <div className="note-content">
        <h3 className="note-title">{note.title}</h3>
        <p className="note-text">{note.content}</p>
      </div>
      <button className="delete-btn" onClick={() => deleteNote(note.id)}>
        Delete
      </button>
    </div>
  );
}

export default NoteItem;