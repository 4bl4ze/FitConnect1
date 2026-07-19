package com.fitconnect.backend.repository;

import com.fitconnect.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Fetches conversation history between two users
    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.senderEmail = :user1 AND m.receiverEmail = :user2) OR " +
            "(m.senderEmail = :user2 AND m.receiverEmail = :user1) " +
            "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversationHistory(@Param("user1") String user1, @Param("user2") String user2);

    // Useful for loading all recent messages for a user (to display recent chats list)
    List<ChatMessage> findBySenderEmailOrReceiverEmailOrderByTimestampDesc(String senderEmail, String receiverEmail);
}