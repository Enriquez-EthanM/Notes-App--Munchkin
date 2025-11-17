package g5.csit360.notes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import g5.csit360.notes.entity.NotesEntity;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface NotesRepository extends JpaRepository<NotesEntity, Integer> {
    Optional<NotesEntity> findByTitle(String title);
}