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
import { getNotes, createNote as createNoteAPI, updateNote as updateNoteAPI, deleteNote as deleteNoteAPI } from './service/notesServices';
import { toggleFavorite as toggleFavoriteAPI } from './service/favoriteServices';
import { moveToTrash, restoreFromTrash, permanentlyDelete, getTrashedNotes } from './service/trashServices';

function App() {
  const [notes, setNotes] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [dark, setDark] = useState(false);

  // Load notes from backend
  useEffect(() => {
    loadNotes();
    loadTrashedNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const loadTrashedNotes = async () => {
    try {
      const data = await getTrashedNotes();
      setTrashedNotes(data);
    } catch (error) {
      console.error('Failed to load trashed notes:', error);
    }
  };

  // Dark mode toggle
  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [dark]);

  const addNote = async (note) => {
    try {
      const newNote = await createNoteAPI(note);
      setNotes([newNote, ...notes]);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteAPI(id);
      setNotes(notes.filter((note) => note.id !== id));
      if (editingNote && editingNote.id === id) setEditingNote(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const confirmDelete = async (id) => {
    const ok = window.confirm('Move note to Recently Deleted?');
    if (!ok) return;
    try {
      const updated = await moveToTrash(id);
      setNotes(notes.map(n => n.id === id ? updated : n));
      if (editingNote && editingNote.id === id) setEditingNote(null);
      // Reload to ensure fresh data
      await loadNotes();
      await loadTrashedNotes();
    } catch (error) {
      console.error('Failed to move to trash:', error);
    }
  };

  const purgeNote = async (id) => {
    const ok = window.confirm('Delete forever? This cannot be undone.');
    if (!ok) return;
    try {
      await permanentlyDelete(id);
      setTrashedNotes(trashedNotes.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to permanently delete:', error);
    }
  };

  const restoreNote = async (id) => {
    try {
      const restored = await restoreFromTrash(id);
      setTrashedNotes(trashedNotes.filter(n => n.id !== id));
      // Reload to ensure fresh data
      await loadNotes();
      await loadTrashedNotes();
    } catch (error) {
      console.error('Failed to restore note:', error);
    }
  };

  const startEditNote = (note) => {
    setEditingNote(note);
  };

  const updateNote = async (updatedNote) => {
    try {
      const updated = await updateNoteAPI(updatedNote.id, updatedNote);
      setNotes(notes.map((note) => note.id === updated.id ? updated : note));
      setEditingNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const updated = await toggleFavoriteAPI(id);
      setNotes(notes.map(n => n.id === id ? updated : n));
      // Reload to ensure fresh data
      await loadNotes();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const counts = useMemo(() => ({
    total: notes.length,
    favorites: notes.filter(n => n.favorite).length,
    deleted: trashedNotes.length,
  }), [notes, trashedNotes]);

  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: dark ? 'linear-gradient(135deg, #0b1220 0%, #0f172a 40%, #111827 100%)' : 'linear-gradient(135deg, #f0f3ffff 0%, #1f4ce0ff 30%, #fdf2f8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Segoe UI, Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: '90%',
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

          <Navbar style={{ width: '90%' }} dark={dark} toggleDark={() => setDark(!dark)} />

          <main style={{ width: '100%', marginTop: '6px' }}>
            <Routes>
              <Route path="/" element={<Dashboard notes={notes} trashedNotes={trashedNotes} />} />
              <Route
                path="/notes"
                element={
                  <NotesPage
                    notes={notes}
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
                element={<Trash notes={trashedNotes} restoreNote={restoreNote} purgeNote={purgeNote} />}
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