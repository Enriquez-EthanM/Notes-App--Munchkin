import { useState, useEffect } from "react";
import './css/NoteForm.css'

function NoteForm({ addNote, updateNote, editingNote }) {
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setNoteContent(editingNote.content);
      setNoteTitle(editingNote.title);
      setFavorite(!!editingNote.favorite);
    } else {
      setNoteContent("");
      setNoteTitle("");
      setFavorite(false);
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim() || !noteTitle.trim()) return;

    if (editingNote) {
      updateNote({
        ...editingNote,
        title: noteTitle,
        content: noteContent,
        favorite: !!favorite,
      });
    } else {
      addNote({ title: noteTitle, content: noteContent, favorite: !!favorite });
    }
    setNoteContent("");
    setNoteTitle("");
    setFavorite(false);
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
        placeholder="What's the title..."
      />
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Write a note..."
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#334155', fontWeight: 600 }}>
        <input type="checkbox" checked={favorite} onChange={(e)=>setFavorite(e.target.checked)} />
        Mark as favorite
      </label>
      <button type="submit">{editingNote ? "Update Note" : "Add Note"}</button>
    </form>
  );
}

export default NoteForm;