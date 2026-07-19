package com.fitconnect.backend.repository;

import com.fitconnect.backend.model.ScheduledWorkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduledWorkoutRepository extends JpaRepository<ScheduledWorkout, Long> {

    // Finds all workouts for a user within a specific date range (for the UI)
    List<ScheduledWorkout> findByUserIdAndScheduledDateBetween(Long userId, LocalDate start, LocalDate end);
}