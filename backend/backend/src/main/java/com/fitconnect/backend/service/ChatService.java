package com.fitconnect.backend.service;

import com.fitconnect.backend.model.ChatMessage;
import com.fitconnect.backend.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatRepository;

    public ChatService(ChatMessageRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public ChatMessage saveMessage(ChatMessage message) {
        return chatRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(String user1, String user2) {
        return chatRepository.findConversationHistory(user1, user2);
    }
}