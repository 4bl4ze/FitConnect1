package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.AuthRequest;
import com.fitconnect.backend.dto.AuthResponse;
import com.fitconnect.backend.model.User;
import com.fitconnect.backend.repository.UserRepository;
import com.fitconnect.backend.service.EmailService;
import com.fitconnect.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Injected to load user details cleanly
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFullName(request.getFullName());

            userRepository.save(user);

            // Use the service to load user details for the token
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("diagnosticError", "Backend Crashed during registration!");
            errorDetails.put("message", e.getMessage());
            return ResponseEntity.status(500).body(errorDetails);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Use the service to load user details for the token
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("diagnosticError", "Login failed! Check your credentials.");
            errorDetails.put("message", e.getMessage());
            return ResponseEntity.status(401).body(errorDetails);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                return ResponseEntity.badRequest().body("User with this email does not exist.");
            }

            String token = UUID.randomUUID().toString();
            user.setVerificationToken(token);
            userRepository.save(user);

            emailService.sendVerificationEmail(email, token);

            return ResponseEntity.ok("Password reset link sent to your email.");

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("diagnosticError", "Failed to send reset email!");
            errorDetails.put("message", e.getMessage());
            return ResponseEntity.status(500).body(errorDetails);
        }
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Token and new password are required.");
            }

            // Look up the user by the verification token saved during forgot-password
            User user = userRepository.findByVerificationToken(token)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid or expired password reset token.");
            }

            // Encode the new password and clear the used token
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setVerificationToken(null);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password successfully reset!"));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("diagnosticError", "Failed to reset password!");
            errorDetails.put("message", e.getMessage());
            return ResponseEntity.status(500).body(errorDetails);
        }
    }

}