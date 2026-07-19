package com.fitconnect.backend.controller;

import com.fitconnect.backend.model.User;
import com.fitconnect.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
}