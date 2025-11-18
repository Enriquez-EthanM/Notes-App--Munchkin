package g5.csit360.notes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g5.csit360.notes.entity.NotesEntity;
import g5.csit360.notes.repository.NotesRepository;

@Service
public class TrashService {
    @Autowired
    private NotesRepository notesRepository;

    public List<NotesEntity> getTrashedNotes() {
        return notesRepository.findAll().stream()
                .filter(note -> Boolean.TRUE.equals(note.getTrashed()))
                .toList();
    }

    public NotesEntity moveToTrash(int id) {
        return notesRepository.findById(id).map(note -> {
            note.setTrashed(true);
            return notesRepository.save(note);
        }).orElse(null);
    }

    public NotesEntity restoreFromTrash(int id) {
        return notesRepository.findById(id).map(note -> {
            note.setTrashed(false);
            return notesRepository.save(note);
        }).orElse(null);
    }

    public boolean permanentlyDelete(int id) {
        return notesRepository.findById(id).map(note -> {
            if (Boolean.TRUE.equals(note.getTrashed())) {
                notesRepository.delete(note);
                return true;
            }
            return false;
        }).orElse(false);
    }

    public void emptyTrash() {
        List<NotesEntity> trashedNotes = getTrashedNotes();
        notesRepository.deleteAll(trashedNotes);
    }
}
