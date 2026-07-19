package com.fitconnect.backend.controller;

import com.fitconnect.backend.model.ChatMessage;
import com.fitconnect.backend.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // Constructor injection is preferred over @Autowired on fields
    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage, Principal principal) {
        // 1. Set sender from the authenticated user (JWT)
        chatMessage.setSenderEmail(principal.getName());

        // 2. Save to database using the service
        chatService.saveMessage(chatMessage);

        // 3. Send to the receiver's private queue
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverEmail(),
                "/queue/messages",
                chatMessage
        );
    }
}