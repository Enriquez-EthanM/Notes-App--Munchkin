import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import './App.css'
import NotesPage from "./pages/NotesPage";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const addNote = (note) => {
    const newNote = { ...note, id: Date.now() };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    // If deleting the note being edited, cancel edit mode
    if (editingNote && editingNote.id === id) setEditingNote(null);
  };

  const startEditNote = (note) => {
    setEditingNote(note);
  };

  const updateNote = (updatedNote) => {
    setNotes(
      notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );
    setEditingNote(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <NotesPage
              notes={notes}
              addNote={addNote}
              deleteNote={deleteNote}
              editingNote={editingNote}
              startEditNote={startEditNote}
              updateNote={updateNote}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;