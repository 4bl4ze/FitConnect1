package com.fitconnect.backend.controller;

import com.fitconnect.backend.model.Friendship;
import com.fitconnect.backend.model.User;
import com.fitconnect.backend.repository.UserRepository;
import com.fitconnect.backend.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<Friendship> sendRequest(@PathVariable Long receiverId, Principal principal) {
        User sender = getAuthenticatedUser(principal);
        return ResponseEntity.ok(friendshipService.sendRequest(sender, receiverId));
    }

    @PutMapping("/accept/{friendshipId}")
    public ResponseEntity<Friendship> acceptRequest(@PathVariable Long friendshipId, Principal principal) {
        User currentUser = getAuthenticatedUser(principal);
        return ResponseEntity.ok(friendshipService.acceptRequest(friendshipId, currentUser));
    }

    // NEW: Endpoint to view pending friend requests
    @GetMapping("/requests/pending")
    public ResponseEntity<List<Friendship>> getPendingRequests(Principal principal) {
        User currentUser = getAuthenticatedUser(principal);
        return ResponseEntity.ok(friendshipService.getPendingRequests(currentUser));
    }

    // NEW: Endpoint to view accepted friends
    @GetMapping("/list")
    public ResponseEntity<List<Friendship>> getFriendsList(Principal principal) {
        User currentUser = getAuthenticatedUser(principal);
        return ResponseEntity.ok(friendshipService.getFriendsList(currentUser));
    }
}