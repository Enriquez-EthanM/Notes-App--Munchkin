package main.java.g5.csit360.notes.entity;

import java.time.LocalDateTime;

import org.springframework.stereotype.Entity;
import org.springframework.lang.NonNull;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Data
@Table(name = "notes")
public class NotesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NonNull
    @Column(unique = true)
    private String title;

    @Nullable
    private String content;

    @NonNull
    private LocalDateTime createdAt;

    @NonNull
    private LocalDateTime updatedAt;
}