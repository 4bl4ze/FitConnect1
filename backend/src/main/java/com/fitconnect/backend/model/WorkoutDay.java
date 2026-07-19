package com.fitconnect.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class WorkoutDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String day;
    private String focus;

    // --- NEW: Added date field for the StreakService ---
    private LocalDateTime date = LocalDateTime.now();

    // --- UPDATED: Prevents Hibernate from creating an unnecessary join table ---
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "workout_day_id")
    private List<Exercise> exercises;
}