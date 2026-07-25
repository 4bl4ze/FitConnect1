
package com.fitconnect.backend.controller;

import com.fitconnect.backend.model.User;
import com.fitconnect.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // POST: http://localhost:8080/api/users
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // GET: http://localhost:8080/api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // PUT: http://localhost:8080/api/users/{email}
    @PutMapping("/{email}")
    public ResponseEntity<User> updateUserProfile(
            @PathVariable String email,
            @RequestBody User updatedData) {

        User updatedUser = userService.updateUserProfile(email, updatedData);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

