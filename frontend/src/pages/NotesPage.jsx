import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import "./css/NotesPage.css";

function NotesPage({ notes, addNote, deleteNote, editingNote, startEditNote, updateNote, toggleFavorite, confirmDelete }) {
  return (
    <div className="notes-page">
      <div className="notes-form-section">
        <h2 className="note-title">{editingNote ? "Edit Note" : "Add a Note"}</h2>
        <NoteForm
          addNote={addNote}
          updateNoteProp={updateNote}
          editingNote={editingNote}
        />
      </div>
      <div className="notes-list-section">
        <h2 className="note-title">Your Notes</h2>
          <NoteList
            notes={notes}
            deleteNote={confirmDelete}
            startEditNote={startEditNote}
            toggleFavorite={toggleFavorite}
            permanentDelete={deleteNote}
          />
      </div>
    </div>
  );
}

export default NotesPage;