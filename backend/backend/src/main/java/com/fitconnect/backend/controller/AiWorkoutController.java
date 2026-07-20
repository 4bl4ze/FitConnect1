package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.AiWorkoutRequest;
import com.fitconnect.backend.model.WorkoutPlan;
import com.fitconnect.backend.service.CalendarService; // Added
import com.fitconnect.backend.service.FitnessAiService;
import com.fitconnect.backend.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/ai/workouts")
@RequiredArgsConstructor
public class AiWorkoutController {

    private final FitnessAiService fitnessAiService;
    private final WorkoutService workoutService;
    private final CalendarService calendarService; // Injected

    // --- GENERATION ENDPOINT ---
    @PostMapping
    public ResponseEntity<WorkoutPlan> generatePlan(
            @Valid @RequestBody AiWorkoutRequest request,
            @RequestParam(value = "userId", required = false) Long manualUserId,
            Principal principal) {

        // 1. Identify User from Principal (Consistent with analysis endpoint)
        Long userId = extractUserIdFromPrincipal(principal);

        // Fallback to Postman input if Principal is null
        if (userId == null && manualUserId != null) {
            userId = manualUserId;
        }

        if (userId == null) {
            throw new RuntimeException("Authentication failed: Could not extract user ID.");
        }

        // 2. Generate and Save Plan
        WorkoutPlan rawPlan = fitnessAiService.generateWorkoutPlan(
                request.goal(),
                request.experienceLevel(),
                request.daysPerWeek()
        );
        WorkoutPlan savedPlan = workoutService.saveWorkoutPlan(rawPlan);

        // 3. Auto-populate the Calendar
        calendarService.generateSchedule(userId, savedPlan);

        return ResponseEntity.ok(savedPlan);
    }

    // --- BODY ANALYSIS ENDPOINT ---
    @PostMapping("/analyze-body")
    public ResponseEntity<String> analyzePhysique(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "userId", required = false) Long manualUserId,
            Principal principal) {

        Long userId = extractUserIdFromPrincipal(principal);

        // Fallback to Postman input if Principal is null
        if (userId == null && manualUserId != null) {
            userId = manualUserId;
        }

        if (userId == null) {
            throw new RuntimeException("Authentication failed: Could not extract user ID.");
        }

        String analysisResult = fitnessAiService.analyzePhysique(userId, image);
        return ResponseEntity.ok(analysisResult);
    }

    // --- HELPER METHOD TO REDUCE CODE DUPLICATION ---
    private Long extractUserIdFromPrincipal(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken authToken) {
            Object userPrincipal = authToken.getPrincipal();
            try {
                return (Long) userPrincipal.getClass().getMethod("getId").invoke(userPrincipal);
            } catch (Exception e) {
                try {
                    return (Long) userPrincipal.getClass().getMethod("getUserId").invoke(userPrincipal);
                } catch (Exception ex) {
                    System.out.println("Warning: Could not extract ID from Principal.");
                }
            }
        }
        return null;
    }

    // --- RETRIEVAL ENDPOINTS ---
    @GetMapping("/all")
    public ResponseEntity<List<WorkoutPlan>> getAllPlans() {
        return ResponseEntity.ok(workoutService.getAllWorkoutPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlan> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutService.getWorkoutPlanById(id));
    }
}