package com.fitconnect.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false) // Ensures no duplicate accounts
    private String email;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @JsonIgnore
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean verified = false;

    private String verificationToken;
    private LocalDateTime verificationTokenExpiry;

    // Added field for Personal Best
    private int allTimeMaxStreak = 0;

    // Link this to WorkoutPlan, which holds the generated workouts
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<WorkoutPlan> workoutPlans = new ArrayList<>();
}