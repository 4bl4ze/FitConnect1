package com.fitconnect.backend.repository;

import com.fitconnect.backend.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    // Keeps your original method in case you need it elsewhere
    List<Workout> findByUserId(Long userId);

    // ADDED: This lets Spring Data JPA automatically join the User table
    // and query by the email extracted from the JWT token.
    List<Workout> findByUserEmail(String email);
}