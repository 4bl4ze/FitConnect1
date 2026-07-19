package com.fitconnect.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "workouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Exercise name is required")
    private String exerciseName;

    @Min(value = 1, message = "Sets must be at least 1")
    private int sets;

    @Min(value = 1, message = "Reps must be at least 1")
    private int reps;

    private double weight;

    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    // This hook forces the date to be set if it is missing
    // right before the object is saved to the database.
    @PrePersist
    protected void onCreate() {
        if (this.date == null) {
            this.date = LocalDateTime.now();
        }
    }
}