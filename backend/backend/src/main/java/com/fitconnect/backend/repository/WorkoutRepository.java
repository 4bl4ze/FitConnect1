package com.fitconnect.backend.controller;

import com.fitconnect.backend.model.Workout;
import com.fitconnect.backend.repository.UserRepository;
import com.fitconnect.backend.repository.WorkoutRepository;
import com.fitconnect.backend.service.StreakService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final StreakService streakService;

    // SECURED POST: Create a workout for the currently authenticated user
    @PostMapping
    public ResponseEntity<?> createWorkout(
            @Valid @RequestBody Workout workout,
            Principal principal) {

        String email = principal.getName();

        return userRepository.findByEmail(email)
                .map(user -> {
                    workout.setUser(user);
                    return ResponseEntity.ok(workoutRepository.save(workout));
                })
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    // SECURED GET: Retrieve all workouts belonging to the authenticated user
    @GetMapping
    public ResponseEntity<List<Workout>> getMyWorkouts(Principal principal) {
        String email = principal.getName();

        List<Workout> workouts = workoutRepository.findByUserEmail(email);
        return ResponseEntity.ok(workouts);
    }

    // SECURED GET: Retrieve the currently logged-in user's workout streak
    @GetMapping("/streak")
    public ResponseEntity<Integer> getMyStreak(Principal principal) {
        String email = principal.getName();

        int currentStreak = streakService.calculateCurrentStreak(email);
        return ResponseEntity.ok(currentStreak);
    }
}