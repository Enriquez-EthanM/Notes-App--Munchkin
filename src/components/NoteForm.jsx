import { useState, useEffect } from "react";
import './css/NoteForm.css'

function NoteForm({ addNote, updateNote, editingNote }) {
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  useEffect(() => {
    if (editingNote) {
      setNoteContent(editingNote.content);
      setNoteTitle(editingNote.title);
    } else {
      setNoteContent("");
      setNoteTitle("");
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
      });
    } else {
      addNote({ title: noteTitle, content: noteContent });
    }
    setNoteContent("");
    setNoteTitle("");
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
      <button type="submit">{editingNote ? "Update Note" : "Add Note"}</button>
    </form>
  );
}

export default NoteForm;