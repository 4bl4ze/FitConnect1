//package com.fitconnect.backend.service;
//
//import com.fitconnect.backend.model.User;
//import com.fitconnect.backend.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public User saveUser(User user) {
//        return userRepository.save(user);
//    }
//
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//}

package com.fitconnect.backend.service;

import com.fitconnect.backend.model.User;
import com.fitconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserProfile(String email, User updatedData) {
        return userRepository.findByEmail(email).map(existingUser -> {
            // Checks if fullName or displayName were supplied in the payload
            if (updatedData.getFullName() != null) {
                existingUser.setFullName(updatedData.getFullName());
            }
            if (updatedData.getGoal() != null) {
                existingUser.setGoal(updatedData.getGoal());
            }
            if (updatedData.getLevel() != null) {
                existingUser.setLevel(updatedData.getLevel());
            }
            if (updatedData.getPhotoURL() != null) {
                existingUser.setPhotoURL(updatedData.getPhotoURL());
            }
            return userRepository.save(existingUser);
        }).orElse(null);
    }
}




