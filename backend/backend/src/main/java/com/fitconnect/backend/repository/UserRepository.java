package com.fitconnect.backend.repository;

import com.fitconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Used for Login and JWT Token generation
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String token);

    // Used during Registration to check if the email is already taken
    boolean existsByEmail(String email);
}