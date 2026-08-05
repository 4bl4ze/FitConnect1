package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.AuthRequest;
import com.fitconnect.backend.dto.AuthResponse;
import com.fitconnect.backend.model.User;
import com.fitconnect.backend.repository.UserRepository;
import com.fitconnect.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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

    @Value("${app.verification.base-url:http://localhost:8080/api/auth/verify}")
    private String verificationBaseUrl;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required."));
            }
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required."));
            }
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
            }

            String displayName = request.getFullName();
            if (displayName == null || displayName.isBlank()) {
                displayName = request.getName();
            }
            if (displayName == null || displayName.isBlank()) {
                displayName = request.getEmail().split("@")[0];
            }

            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFullName(displayName);
            user.setVerified(true); // Auto-verify user so sign in works immediately

            userRepository.save(user);

            // Generate JWT token for immediate login upon registration
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("diagnosticError", "Registration failed: " + e.getMessage());
            errorDetails.put("message", "Registration failed. Please check your details or try again.");
            return ResponseEntity.status(500).body(errorDetails);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required."));
            }
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required."));
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
            if (optionalUser.isPresent() && !optionalUser.get().isVerified()) {
                User user = optionalUser.get();
                user.setVerified(true);
                userRepository.save(user);
            }

            // Use the service to load user details for the token
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (org.springframework.security.core.AuthenticationException e) {
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("diagnosticError", "Invalid email or password.");
            errorDetails.put("message", "Invalid email or password. Check your credentials.");
            return ResponseEntity.status(401).body(errorDetails);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("diagnosticError", "Login failed: " + e.getMessage());
            errorDetails.put("message", "Sign in service encountered an internal error. Please try again or use offline mode.");
            return ResponseEntity.status(500).body(errorDetails);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired verification token.");
        }

        User user = optionalUser.get();
        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Email already verified.");
        }

        if (user.getVerificationTokenExpiry() == null || user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification token has expired.");
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully. You can now log in.");
    }

    private void sendVerificationEmail(User user) {
        String verificationUrl = verificationBaseUrl + "?token=" + user.getVerificationToken();
        System.out.println("[EMAIL VERIFICATION] Send verification link to " + user.getEmail() + ": " + verificationUrl);
    }
}