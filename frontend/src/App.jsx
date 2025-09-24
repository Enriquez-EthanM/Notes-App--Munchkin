import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import React, { useEffect, useMemo, useState } from 'react';
import logo from './assets/munchkin.png';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Trash from './pages/Trash';

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [dark, setDark] = useState(false);

  // Dark mode toggle
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);

  const addNote = (note) => {
    const now = Date.now();
    const newNote = { id: now, createdAt: now, updatedAt: now, favorite: !!note.favorite, deletedAt: null, ...note };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (editingNote && editingNote.id === id) setEditingNote(null);
  };

  const confirmDelete = (id) => {
    const ok = window.confirm('Move note to Recently Deleted?');
    if (!ok) return;
    setNotes(notes.map(n => n.id === id ? { ...n, deletedAt: Date.now() } : n));
    if (editingNote && editingNote.id === id) setEditingNote(null);
  };

  const purgeNote = (id) => {
    const ok = window.confirm('Delete forever? This cannot be undone.');
    if (!ok) return;
    setNotes(notes.filter(n => n.id !== id));
  };

  const restoreNote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, deletedAt: null } : n));
  };

  const startEditNote = (note) => {
    setEditingNote(note);
  };

  const updateNote = (updatedNote) => {
    setNotes(
      notes.map((note) =>
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: Date.now() } : note
      )
    );
    setEditingNote(null);
  };

  const toggleFavorite = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n));
  };

  const counts = useMemo(() => ({
    total: notes.filter(n => !n.deletedAt).length,
    favorites: notes.filter(n => n.favorite && !n.deletedAt).length,
    deleted: notes.filter(n => !!n.deletedAt).length,
  }), [notes]);

  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: dark ? 'linear-gradient(135deg, #0b1220 0%, #0f172a 40%, #111827 100%)' : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 30%, #fdf2f8 100%)',
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
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 28,
            boxShadow: '0 20px 60px rgba(99,102,241,0.18)',
            padding: '2rem 2rem 2.2rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            backdropFilter: 'blur(8px)',
          }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src={logo} alt="NoteApp Logo" style={{ width: 40, height: 40 }} />
              <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#6366f1', margin: 0 }}>
                Munchkin Notes
              </h1>
            </div>
          </header>

          <Navbar dark={dark} toggleDark={() => setDark(!dark)} />

          <main style={{ width: '100%', marginTop: '6px' }}>
            <Routes>
              <Route path="/" element={<Dashboard notes={notes} />} />
              <Route
                path="/notes"
                element={
                  <NotesPage
                    notes={notes.filter(n => !n.deletedAt)}
                    addNote={addNote}
                    deleteNote={deleteNote}
                    editingNote={editingNote}
                    startEditNote={startEditNote}
                    updateNote={updateNote}
                    toggleFavorite={toggleFavorite}
                    confirmDelete={confirmDelete}
                  />
                }
              />
              <Route
                path="/favorites"
                element={
                  <Favorites
                    notes={notes}
                    deleteNote={deleteNote}
                    startEditNote={startEditNote}
                    toggleFavorite={toggleFavorite}
                  />
                }
              />
              <Route
                path="/trash"
                element={<Trash notes={notes} restoreNote={restoreNote} purgeNote={purgeNote} />}
              />
            </Routes>
          </main>

          <footer style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '1.5rem', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} Munchkin Notes. All rights reserved. Jv Gwapo
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;