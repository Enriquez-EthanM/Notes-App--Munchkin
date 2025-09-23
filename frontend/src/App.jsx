import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import React, { useState } from 'react';
import logo from './assets/munchkin.png';

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const addNote = (note) => {
    const newNote = { ...note, id: Date.now() };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
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
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          minHeight: 600,
          background: '#fff',
          borderRadius: 28,
          boxShadow: '0 12px 48px rgba(99,102,241,0.14)',
          padding: '3.5rem 3rem 2.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <img src={logo} alt="NoteApp Logo" style={{ width: 48, height: 48 }} />
          <h1 style={{ fontWeight: 700, fontSize: '2.5rem', color: '#6366f1', margin: 0 }}>
            Munchkin Notes
          </h1>
        </header>

        <main style={{ width: '100%' ,}}>
          <div style={{ display: 'flex', gap: '2rem', width: '100%' }}>
            <div style={{ flex: 1.2 }}>
                <NoteForm
                  style={{ height: '500px' }} // Added height to NoteForm
                addNote={addNote}
                editingNote={editingNote}
                updateNote={updateNote}
              />
            </div>
            <div style={{ flex: 1.5, height: '500px', maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden', wordBreak: 'break-word' }}>
              <NoteList
                notes={notes}
                deleteNote={deleteNote}
                startEditNote={startEditNote}
              />
            </div>
          </div>
        </main>

        <footer style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '2rem', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Munchkin Notes. All rights reserved. Jv Gwapo
        </footer>
      </div>
    </div>
  );
}

export default App;