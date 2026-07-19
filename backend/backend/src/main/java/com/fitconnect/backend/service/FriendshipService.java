package com.fitconnect.backend.service;

import com.fitconnect.backend.model.Friendship;
import com.fitconnect.backend.model.FriendshipStatus;
import com.fitconnect.backend.model.User;
import com.fitconnect.backend.repository.FriendshipRepository;
import com.fitconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public Friendship sendRequest(User sender, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Friendship friendship = Friendship.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendshipStatus.PENDING)
                .build();
        return friendshipRepository.save(friendship);
    }

    public Friendship acceptRequest(Long friendshipId, User currentUser) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!friendship.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: You can only accept requests sent to you");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    // NEW: Get pending requests sent TO the user
    public List<Friendship> getPendingRequests(User currentUser) {
        return friendshipRepository.findByReceiverAndStatus(currentUser, FriendshipStatus.PENDING);
    }

    // NEW: Get all accepted friends (whether the user sent or received the request)
    public List<Friendship> getFriendsList(User currentUser) {
        return friendshipRepository.findBySenderOrReceiverAndStatus(currentUser, currentUser, FriendshipStatus.ACCEPTED);
    }
}