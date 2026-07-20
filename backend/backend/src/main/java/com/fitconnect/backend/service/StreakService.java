package com.fitconnect.backend.service;

import com.fitconnect.backend.model.User;
import com.fitconnect.backend.model.WorkoutDay; // Updated to match the nested entity
import com.fitconnect.backend.model.WorkoutPlan;
import com.fitconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StreakService {

    @Autowired
    private UserRepository userRepository;

    public int calculateCurrentStreak(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WorkoutPlan> plans = user.getWorkoutPlans();

        if (plans == null || plans.isEmpty()) {
            return 0;
        }

        // Flatten the plans to get all individual workout days, then extract the dates
        List<LocalDate> uniqueSortedDates = plans.stream()
                .filter(plan -> plan.getWorkouts() != null)
                .flatMap(plan -> plan.getWorkouts().stream()) // Extracts workouts from all plans
                .filter(day -> day.getDate() != null)
                .map(day -> day.getDate().toLocalDate())
                .distinct()
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());

        if (uniqueSortedDates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate mostRecent = uniqueSortedDates.get(0);

        // If the streak is broken, return 0 (do not update Max Streak)
        if (mostRecent.isBefore(yesterday)) {
            return 0;
        }

        // Calculate actual current streak
        int streak = 1;
        LocalDate expected = mostRecent.minusDays(1);

        for (int i = 1; i < uniqueSortedDates.size(); i++) {
            if (uniqueSortedDates.get(i).equals(expected)) {
                streak++;
                expected = expected.minusDays(1);
            } else {
                break;
            }
        }

        // Logic to update All-Time Max Streak
        if (streak > user.getAllTimeMaxStreak()) {
            user.setAllTimeMaxStreak(streak);
            userRepository.save(user);
        }

        return streak;
    }
}