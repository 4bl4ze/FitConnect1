package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.AuthRequest;
import com.fitconnect.backend.dto.AuthResponse;
import com.fitconnect.backend.model.User;
import com.fitconnect.backend.repository.UserRepository;
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
}