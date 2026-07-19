package com.fitconnect.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "workout_plans")
@Data
public class WorkoutPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("plan_name")
    private String planName;

    @JsonProperty("days_per_week")
    private int daysPerWeek;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "workout_plan_id") // Prevents Hibernate from creating an unnecessary join table
    private List<WorkoutDay> workouts;

    // --- NEW: Link back to the User ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
}