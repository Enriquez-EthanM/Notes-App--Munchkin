package main.java.g5.csit360.notes.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
public class NotesController {
    private final NotesService notesService;

    @GetMapping
    public ResponseEntity<List<NotesEntity>> getAllNotes() {
        return ResponseEntity.ok(notesService.getAllNotes());
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