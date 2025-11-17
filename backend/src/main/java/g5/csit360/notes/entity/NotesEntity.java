package g5.csit360.notes.entity;

import java.time.LocalDateTime;

import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Data
@Table(name = "notes")
public class NotesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String title;

    @Nullable
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // NEW: store blockchain transaction hash
    @Column(name = "tx_hash", nullable = true)
    private String txHash;

    //Timestamp issue fix
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}