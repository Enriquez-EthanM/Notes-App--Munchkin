import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import "./css/NotesPage.css";
import { useEffect,useState } from "react";
import {getNotes, createNote, updateNote, deleteNote} from "../service/notesServices";


function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  
  //FETCH call every render/page reload
  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await getNotes();
        setNotes(data); //fix issue where notes array population ma delete taga reload
      } catch (err) {
        console.error("Failed to load notes:", err);
      }
    }

    loadNotes();
  }, []);

  //CREATE call
  const addNote = async(note) => {
    try{
      const newNote = await createNote(note);
      setNotes((prev) => [...prev, newNote]);
    }catch(error){
      console.error (error)
    }
  }

  //PUT call
  const updateExistingNote = async (id, note) => {
    try {
      const updated = await updateNote(id, note);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setEditingNote(null);
    } catch (err) {
      console.error(err);
    }
  };

  //DELETE call
  const removeNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEditNote = (note) => setEditingNote(note);

  return (
    <div className="notes-page">
      <div className="notes-form-section">
        <h2>{editingNote ? "Edit Note" : "Add a Note"}</h2>
        <NoteForm
          addNote={addNote}
          updateNoteProp={updateExistingNote}
          editingNote={editingNote}
        />
      </div>
      <div className="notes-list-section">
        <h2>Your Notes</h2>
          <NoteList
            notes={notes}
            deleteNote={removeNote}
            startEditNote={startEditNote}
          />
      </div>
    </div>
  );
}


export default NotesPage;