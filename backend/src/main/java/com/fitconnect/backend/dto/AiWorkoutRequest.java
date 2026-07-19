package com.fitconnect.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AiWorkoutRequest(
        @NotBlank(message = "Fitness goal is required (e.g., Hypertrophy, Weight Loss, Strength)")
        String goal,

        @NotBlank(message = "Experience level is required (e.g., Beginner, Intermediate, Advanced)")
        String experienceLevel,

        @NotNull(message = "Days per week is required")
        @Min(value = 1, message = "Must work out at least 1 day a week")
        @Max(value = 7, message = "Cannot exceed 7 days a week")
        Integer daysPerWeek
) {}