package com.fitconnect.backend.repository;

import com.fitconnect.backend.model.Friendship;
import com.fitconnect.backend.model.FriendshipStatus;
import com.fitconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // Find all friendships for a user (either as sender or receiver) with a specific status
    List<Friendship> findBySenderOrReceiverAndStatus(User sender, User receiver, FriendshipStatus status);

    // Find a specific request between two users
    Optional<Friendship> findBySenderAndReceiver(User sender, User receiver);

    // Find all requests where the user is the receiver and the status is PENDING
    List<Friendship> findByReceiverAndStatus(User receiver, FriendshipStatus status);
}