import { useState, useEffect } from "react";
import './css/NoteForm.css'

function NoteForm({ addNote, updateNoteProp, editingNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const note = {
      title,
      content
    };

    if (editingNote) {
      updateNoteProp(editingNote.id, note);
    } else {
      addNote(note);
    }


    setTitle("");
    setContent("");
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">{editingNote ? "Update" : "Add"}</button>
    </form>
  );
}

export default NoteForm;
