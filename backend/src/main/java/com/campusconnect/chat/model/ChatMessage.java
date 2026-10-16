package com.campusconnect.chat.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "messages")
public class ChatMessage {

    @Id
    private String id;

    private String conversationId;

    private String senderId;

    private String senderName;

    private String recipientId;

    private String content;

    private boolean isRead = false;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public ChatMessage() {
    }

    public ChatMessage(String conversationId, String senderId, String senderName, String recipientId, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.recipientId = recipientId;
        this.content = content;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
