package g5.csit360.notes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g5.csit360.notes.entity.NotesEntity;
import g5.csit360.notes.service.NotesService;

@RestController
@RequestMapping("/api/notes")
public class NotesController {
    @Autowired
    NotesService notesService;

    @GetMapping
    public ResponseEntity<List<NotesEntity>> getAllNotes() {
        try {
            List<NotesEntity> notes = notesService.getAllNotes();
            return ResponseEntity.ok(notes); // Will be an empty list if no rows exist
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotesEntity> getNoteById(@PathVariable int id) {
        NotesEntity note = notesService.getNoteById(id);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<NotesEntity> getNoteByTitle(@PathVariable String title) {
        NotesEntity note = notesService.getNoteByTitle(title);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<NotesEntity> createNote(@RequestBody NotesEntity note) {
        NotesEntity createdNote = notesService.createNote(note);
        return ResponseEntity.status(201).body(createdNote);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotesEntity> updateNote(@PathVariable int id, @RequestBody NotesEntity updatedNote) {
        NotesEntity note = notesService.updateNote(id, updatedNote);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable int id) {
        boolean deleted = notesService.deleteNote(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}