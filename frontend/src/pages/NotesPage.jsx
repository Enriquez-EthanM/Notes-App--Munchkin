import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import "./css/NotesPage.css";

function NotesPage({
  notes,
  addNote,
  deleteNote,
  editingNote,
  startEditNote,
  updateNote,
}) {
  return (
    <div className="notes-page">
      <div className="notes-form-section">
        <h2>{editingNote ? "Edit Note" : "Add a Note"}</h2>
        <NoteForm
          addNote={addNote}
          updateNote={updateNote}
          editingNote={editingNote}
        />
      </div>
      <div className="notes-list-section">
        <h2>Your Notes</h2>
        <NoteList
          notes={notes}
          deleteNote={deleteNote}
          startEditNote={startEditNote}
        />
      </div>
    </div>
  );
}

export default NotesPage;