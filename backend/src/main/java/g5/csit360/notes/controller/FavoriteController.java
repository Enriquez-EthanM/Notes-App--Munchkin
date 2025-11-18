package g5.csit360.notes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import g5.csit360.notes.entity.NotesEntity;
import g5.csit360.notes.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<NotesEntity>> getFavoriteNotes() {
        List<NotesEntity> favorites = favoriteService.getFavoriteNotes();
        return ResponseEntity.ok(favorites);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<NotesEntity> toggleFavorite(@PathVariable int id) {
        NotesEntity note = favoriteService.toggleFavorite(id);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/add")
    public ResponseEntity<NotesEntity> addToFavorites(@PathVariable int id) {
        NotesEntity note = favoriteService.setFavorite(id, true);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/remove")
    public ResponseEntity<NotesEntity> removeFromFavorites(@PathVariable int id) {
        NotesEntity note = favoriteService.setFavorite(id, false);
        return note != null ? ResponseEntity.ok(note) : ResponseEntity.notFound().build();
    }
}
