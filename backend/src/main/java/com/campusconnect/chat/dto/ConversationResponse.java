package com.campusconnect.chat.dto;

import com.campusconnect.chat.model.ChatMessage;
import com.campusconnect.chat.model.Conversation;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ConversationResponse {

    private String id;
    private String participantId;
    private String name;
    private String subtitle;
    private String avatarText;
    private String avatarBg;
    private boolean isOnline;
    private String lastMessage;
    private String time;
    private int unreadCount;
    private List<MessageResponse> messages = new ArrayList<>();

    public ConversationResponse() {
    }

    public static ConversationResponse from(Conversation conv, List<ChatMessage> messages, String currentUserId) {
        ConversationResponse res = new ConversationResponse();
        res.setId(conv.getId());
        res.setName(conv.getName() != null ? conv.getName() : "Chat");
        res.setSubtitle(conv.getSubtitle() != null ? conv.getSubtitle() : "Active recently");
        res.setLastMessage(conv.getLastMessage() != null ? conv.getLastMessage() : "");
        res.setOnline(true);


        if (conv.getUnreadCounts() != null && currentUserId != null) {
            res.setUnreadCount(conv.getUnreadCounts().getOrDefault(currentUserId, 0));
        } else {
            res.setUnreadCount(0);
        }

        if (conv.getLastMessageAt() != null) {
            Duration dur = Duration.between(conv.getLastMessageAt(), Instant.now());
            if (dur.toMinutes() < 1) res.setTime("Just now");
            else if (dur.toMinutes() < 60) res.setTime(dur.toMinutes() + "m");
            else if (dur.toHours() < 24) res.setTime(dur.toHours() + "h");
            else res.setTime(dur.toDays() + "d");
        } else {
            res.setTime("Recently");
        }

        if (conv.getParticipants() != null && currentUserId != null) {
            for (String p : conv.getParticipants()) {
                if (!p.equals(currentUserId)) {
                    res.setParticipantId(p);
                    break;
                }
            }
        }
        if (res.getParticipantId() == null && conv.getParticipants() != null && !conv.getParticipants().isEmpty()) {
            res.setParticipantId(conv.getParticipants().get(0));
        }

        // If 1-on-1 chat, show the other person's name
        if (res.getParticipantId() != null && conv.getParticipantNames() != null && conv.getParticipantNames().containsKey(res.getParticipantId())) {
            res.setName(conv.getParticipantNames().get(res.getParticipantId()));
        } else if (conv.getName() != null) {
            res.setName(conv.getName());
        } else {
            res.setName("Chat");
        }

        String initial = (res.getName() != null && !res.getName().trim().isEmpty())
                ? res.getName().trim().substring(0, 1).toUpperCase()
                : "U";
        res.setAvatarText(initial);

        String[] colors = {"bg-[#10b981]", "bg-[#f97316]", "bg-[#06b6d4]", "bg-[#8b5cf6]", "bg-[#ec4899]"};
        int hash = (res.getName() != null) ? res.getName().hashCode() : 0;
        int colorIdx = (hash & 0x7fffffff) % colors.length;
        res.setAvatarBg(colors[colorIdx]);

        if (messages != null) {
            res.setMessages(messages.stream()
                    .map(m -> MessageResponse.from(m, currentUserId))
                    .collect(Collectors.toList()));
        }

        return res;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getParticipantId() { return participantId; }
    public void setParticipantId(String participantId) { this.participantId = participantId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getAvatarText() { return avatarText; }
    public void setAvatarText(String avatarText) { this.avatarText = avatarText; }
    public String getAvatarBg() { return avatarBg; }
    public void setAvatarBg(String avatarBg) { this.avatarBg = avatarBg; }
    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean online) { isOnline = online; }
    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public int getUnreadCount() { return unreadCount; }
    public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }
    public List<MessageResponse> getMessages() { return messages; }
    public void setMessages(List<MessageResponse> messages) { this.messages = messages; }
}
