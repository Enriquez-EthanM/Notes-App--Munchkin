import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import './App.css'
import NotesPage from "./pages/NotesPage";

function App() {
  const [notes, setNotes] = useState([]);


  const addNote = (note) => {
    
    const newNote = { ...note, id: Date.now() };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/"
          element={
            <NotesPage
              notes={notes}
              addNote={addNote}
              deleteNote={deleteNote}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;