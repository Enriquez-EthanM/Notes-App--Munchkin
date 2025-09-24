package g5.csit360.notes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import g5.csit360.notes.entity.NotesEntity;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

public interface NotesRepository extends JpaRepository<NotesEntity, Integer> {
    Optional<NotesEntity> findByTitle(String title);
}
