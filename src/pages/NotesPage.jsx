import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import "./css/NotesPage.css";

function NotesPage({ notes, addNote, deleteNote }) {
  return (
    <div className="notes-page">
      <div className="notes-form-section">
        <h2>Add a Note</h2>
        <NoteForm addNote={addNote} />
      </div>
      <div className="notes-list-section">
        <h2>Your Notes</h2>
        <NoteList notes={notes} deleteNote={deleteNote} />
      </div>
    </div>
  );
}

export default NotesPage;