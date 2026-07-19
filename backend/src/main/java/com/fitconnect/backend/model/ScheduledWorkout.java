package com.fitconnect.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "scheduled_workouts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledWorkout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "workout_plan_id", nullable = false)
    private Long workoutPlanId; // Links to the AI generated plan

    @Column(name = "routine_name", nullable = false)
    private String routineName; // e.g., "Push Day" or "Rest"

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "is_completed")
    @Builder.Default
    private boolean isCompleted = false;
}