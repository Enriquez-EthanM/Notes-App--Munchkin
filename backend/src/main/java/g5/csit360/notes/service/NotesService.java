package g5.csit360.notes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g5.csit360.notes.entity.NotesEntity;
import g5.csit360.notes.repository.NotesRepository;

@Service
public class NotesService {
    @Autowired
    NotesRepository notesRepository;

    public List<NotesEntity> getAllNotes() {
        return notesRepository.findAll().stream()
                .filter(note -> !Boolean.TRUE.equals(note.getTrashed()))
                .toList();
    }

    public NotesEntity getNoteById(int id) {
        return notesRepository.findById(id).orElse(null);
    }

    public NotesEntity getNoteByTitle(String title) {
        return notesRepository.findByTitle(title).orElse(null);
    }

    public NotesEntity createNote(NotesEntity note) {
        return notesRepository.save(note);
    }

    public NotesEntity updateNote(int id, NotesEntity updatedNote) {
        return notesRepository.findById(id).map(note -> {
            note.setTitle(updatedNote.getTitle());
            note.setContent(updatedNote.getContent());
            note.setUpdatedAt(updatedNote.getUpdatedAt());
            return notesRepository.save(note);
        }).orElse(null);
    }

    public boolean deleteNote(int id) {
        return notesRepository.findById(id).map(note -> {
            notesRepository.delete(note);
            return true;
        }).orElse(false);
    }
}
