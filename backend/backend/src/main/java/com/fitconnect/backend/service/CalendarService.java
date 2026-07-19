package com.fitconnect.backend.service;

import com.fitconnect.backend.model.ScheduledWorkout;
import com.fitconnect.backend.model.WorkoutPlan;
import com.fitconnect.backend.repository.ScheduledWorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final ScheduledWorkoutRepository repository;

    public List<ScheduledWorkout> getSchedule(Long userId, LocalDate startDate, LocalDate endDate) {
        return repository.findByUserIdAndScheduledDateBetween(userId, startDate, endDate);
    }

    @Transactional
    public void generateSchedule(Long userId, WorkoutPlan plan) {
        List<ScheduledWorkout> schedule = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Standard 4-week (28 day) rotation
        // You can customize the logic below to match your specific needs
        for (int i = 0; i < 28; i++) {
            LocalDate date = today.plusDays(i);

            // Logic: Train every 2nd day (i % 2 == 0)
            if (i % 2 == 0) {
                // Example: Rotating through routine names
                String routine = "Workout Routine " + ((i / 2) % 3 + 1);

                ScheduledWorkout workout = ScheduledWorkout.builder()
                        .userId(userId)
                        .workoutPlanId(plan.getId())
                        .routineName(routine)
                        .scheduledDate(date)
                        .isCompleted(false)
                        .build();

                schedule.add(workout);
            }
        }

        repository.saveAll(schedule);
    }
}