import NoteItem from "./NoteItem";
import "./css/NoteList.css";

function NoteList({ notes = [], deleteNote, startEditNote, context }) {
  return (
    <div className="note-list">
      {notes.length === 0 ? (
        <p className="empty-message">No notes yet. Add one!</p>
      ) : (
        notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            deleteNote={deleteNote}
            startEditNote={startEditNote}
          />
        ))
      )}
    </div>
  );
}

export default NoteList;