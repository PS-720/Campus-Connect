package com.campusconnect.chat.dto;

import com.campusconnect.chat.model.ChatMessage;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class MessageResponse {

    private String id;
    private String senderId;
    private String senderName;
    private String recipientId;
    private String text;
    private String time;
    private boolean isMe;
    private Instant createdAt;

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH).withZone(ZoneId.systemDefault());

    public MessageResponse() {
    }

    public static MessageResponse from(ChatMessage msg, String currentUserId) {
        MessageResponse res = new MessageResponse();
        res.setId(msg.getId());
        res.setSenderId(msg.getSenderId());
        res.setSenderName(msg.getSenderName());
        res.setRecipientId(msg.getRecipientId());
        res.setText(msg.getContent());
        res.setCreatedAt(msg.getCreatedAt());

        if (currentUserId != null && currentUserId.equals(msg.getSenderId())) {
            res.setMe(true);
        } else {
            res.setMe(false);
        }

        if (msg.getCreatedAt() != null) {
            Duration dur = Duration.between(msg.getCreatedAt(), Instant.now());
            if (dur.toMinutes() < 1) {
                res.setTime("Just now");
            } else if (dur.toHours() < 24) {
                res.setTime(TIME_FORMATTER.format(msg.getCreatedAt()));
            } else {
                res.setTime(dur.toDays() + "d ago");
            }
        } else {
            res.setTime("Just now");
        }

        return res;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public boolean isMe() { return isMe; }
    public void setMe(boolean me) { isMe = me; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
