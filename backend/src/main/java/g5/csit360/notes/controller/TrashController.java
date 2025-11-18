package g5.csit360.notes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g5.csit360.notes.entity.NotesEntity;
import g5.csit360.notes.service.TrashService;

@RestController
@RequestMapping("/api/trash")
public class TrashController {
    @Autowired
    private TrashService trashService;

    @GetMapping
    public ResponseEntity<List<NotesEntity>> getTrashedNotes() {
        List<NotesEntity> trashedNotes = trashService.getTrashedNotes();
        return ResponseEntity.ok(trashedNotes);
    }

    @PatchMapping("/{id}/trash")
    public ResponseEntity<NotesEntity> moveToTrash(@PathVariable int id) {
        NotesEntity note = trashService.moveToTrash(id);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<NotesEntity> restoreFromTrash(@PathVariable int id) {
        NotesEntity note = trashService.restoreFromTrash(id);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentlyDelete(@PathVariable int id) {
        boolean deleted = trashService.permanentlyDelete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Void> emptyTrash() {
        trashService.emptyTrash();
        return ResponseEntity.noContent().build();
    }
}
