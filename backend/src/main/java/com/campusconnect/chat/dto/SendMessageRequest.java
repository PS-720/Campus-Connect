package com.campusconnect.chat.dto;

public class SendMessageRequest {

    private String recipientId;
    private String content;

    public SendMessageRequest() {
    }

    public SendMessageRequest(String recipientId, String content) {
        this.recipientId = recipientId;
        this.content = content;
    }

    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
