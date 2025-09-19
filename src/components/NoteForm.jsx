import { useState } from "react";
import './css/NoteForm.css'
function NoteForm({ addNote }) {
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim() || !noteTitle.trim()) return;

    addNote({ title: noteTitle, content: noteContent });
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
      <button type="submit">Add Note</button>
    </form>
  );
}

export default NoteForm;