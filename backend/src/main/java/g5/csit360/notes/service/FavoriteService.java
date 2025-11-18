package g5.csit360.notes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import g5.csit360.notes.entity.NotesEntity;
import g5.csit360.notes.repository.NotesRepository;

@Service
public class FavoriteService {
    @Autowired
    private NotesRepository notesRepository;

    public List<NotesEntity> getFavoriteNotes() {
        return notesRepository.findAll().stream()
                .filter(note -> Boolean.TRUE.equals(note.getFavorite()) && !Boolean.TRUE.equals(note.getTrashed()))
                .toList();
    }

    public NotesEntity toggleFavorite(int id) {
        return notesRepository.findById(id).map(note -> {
            note.setFavorite(!Boolean.TRUE.equals(note.getFavorite()));
            return notesRepository.save(note);
        }).orElse(null);
    }

    public NotesEntity setFavorite(int id, boolean favorite) {
        return notesRepository.findById(id).map(note -> {
            note.setFavorite(favorite);
            return notesRepository.save(note);
        }).orElse(null);
    }
}
