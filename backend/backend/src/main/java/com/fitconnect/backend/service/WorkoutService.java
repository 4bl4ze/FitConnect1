package com.fitconnect.backend.service;

import com.fitconnect.backend.model.WorkoutPlan;
import com.fitconnect.backend.repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutPlanRepository repository;

    @Transactional
    public WorkoutPlan saveWorkoutPlan(WorkoutPlan plan) {
        // Reset IDs to null to ensure JPA treats them as new records
        plan.setId(null);
        if (plan.getWorkouts() != null) {
            plan.getWorkouts().forEach(day -> {
                day.setId(null);
                if (day.getExercises() != null) {
                    day.getExercises().forEach(ex -> ex.setId(null));
                }
            });
        }
        return repository.save(plan);
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlan> getAllWorkoutPlans() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public WorkoutPlan getWorkoutPlanById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout plan not found with id: " + id));
    }
}