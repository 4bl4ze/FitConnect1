package com.fitconnect.backend.controller;

import com.fitconnect.backend.model.ChatMessage;
import com.fitconnect.backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatHistoryController {

    private final ChatService chatService;

    // Constructor injection for the service
    public ChatHistoryController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/history/{otherUserEmail}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable String otherUserEmail,
            Principal principal) {

        // principal.getName() extracts the email from your JWT subject (sub)
        String currentUserEmail = principal.getName();

        // Fetch history using the service layer instead of the repository directly
        List<ChatMessage> history = chatService.getChatHistory(
                currentUserEmail,
                otherUserEmail
        );

        return ResponseEntity.ok(history);
    }
}