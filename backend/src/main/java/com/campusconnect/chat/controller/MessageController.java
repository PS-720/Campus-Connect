package com.campusconnect.chat.controller;

import com.campusconnect.chat.dto.ConversationResponse;
import com.campusconnect.chat.dto.MessageResponse;
import com.campusconnect.chat.dto.SendMessageRequest;
import com.campusconnect.chat.service.ChatService;
import com.campusconnect.common.dto.ApiResponse;
import com.campusconnect.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final ChatService chatService;

    public MessageController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : null;
        List<ConversationResponse> convs = chatService.listConversations(userId);
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved successfully", convs));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getMessages(
            @PathVariable String userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String currentUserId = currentUser != null ? currentUser.getId() : null;
        List<MessageResponse> messages = chatService.getMessages(userId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved successfully", messages));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody SendMessageRequest request) {
        String currentUserId = currentUser != null ? currentUser.getId() : null;
        MessageResponse msg = chatService.sendMessage(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully", msg));
    }

    @PatchMapping("/{userId}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(
            @PathVariable String userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String currentUserId = currentUser != null ? currentUser.getId() : null;
        chatService.markRead(userId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Conversation marked as read", null));
    }
}
