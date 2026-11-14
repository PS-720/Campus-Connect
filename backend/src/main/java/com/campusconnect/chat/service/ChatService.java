package com.campusconnect.chat.service;

import com.campusconnect.chat.dto.ConversationResponse;
import com.campusconnect.chat.dto.MessageResponse;
import com.campusconnect.chat.dto.SendMessageRequest;
import com.campusconnect.common.exception.BadRequestException;
import com.campusconnect.chat.model.ChatMessage;
import com.campusconnect.chat.model.Conversation;
import com.campusconnect.chat.repository.ChatMessageRepository;
import com.campusconnect.chat.repository.ConversationRepository;
import com.campusconnect.user.model.User;
import com.campusconnect.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatService(ConversationRepository conversationRepository,
                       ChatMessageRepository messageRepository,
                       UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        // Clean out any dummy/demo seed conversations so only real user chats exist
        List<Conversation> all = conversationRepository.findAll();
        for (Conversation c : all) {
            boolean isDummy = c.getParticipants() == null
                    || c.getParticipants().isEmpty()
                    || c.getParticipants().contains("demo_user")
                    || c.getParticipants().contains("sara_liu")
                    || c.getParticipants().contains("marcus_j")
                    || c.getParticipants().contains("coding_club")
                    || c.getParticipants().contains("ai_robotics_group")
                    || c.getParticipants().contains("dev_patel")
                    || c.getParticipants().contains("priya_sharma");

            if (isDummy) {
                messageRepository.deleteByConversationId(c.getId());
                conversationRepository.delete(c);
            }
        }
    }

    public List<ConversationResponse> listConversations(String currentUserId) {
        if (currentUserId == null) {
            return Collections.emptyList();
        }

        List<Conversation> convs = conversationRepository.findByParticipantsContainingOrderByLastMessageAtDesc(currentUserId);
        List<ConversationResponse> result = new ArrayList<>();
        for (Conversation c : convs) {
            List<ChatMessage> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId());
            result.add(ConversationResponse.from(c, msgs, currentUserId));
        }
        return result;
    }

    public List<MessageResponse> getMessages(String conversationOrUserId, String currentUserId) {
        String uid = (currentUserId != null) ? currentUserId : "demo_user";

        // Try find by conversation id
        Optional<Conversation> optConv = conversationRepository.findById(conversationOrUserId);
        if (optConv.isPresent()) {
            List<ChatMessage> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(optConv.get().getId());
            return msgs.stream().map(m -> MessageResponse.from(m, uid)).collect(Collectors.toList());
        }

        // Try find by recipient user id
        List<ChatMessage> msgs = messageRepository.findBySenderIdAndRecipientIdOrSenderIdAndRecipientIdOrderByCreatedAtAsc(
                uid, conversationOrUserId, conversationOrUserId, uid);
        return msgs.stream().map(m -> MessageResponse.from(m, uid)).collect(Collectors.toList());
    }

    public ConversationResponse getOrCreateConversation(String currentUserId, String recipientId) {
        if (currentUserId == null || currentUserId.trim().isEmpty()) {
            throw new BadRequestException("User must be authenticated");
        }
        if (recipientId == null || recipientId.trim().isEmpty()) {
            throw new BadRequestException("Recipient ID cannot be empty");
        }

        // Find existing conversation between currentUserId and recipientId
        List<Conversation> userConvs = conversationRepository.findByParticipantsContainingOrderByLastMessageAtDesc(currentUserId);
        for (Conversation c : userConvs) {
            if (c.getParticipants() != null && c.getParticipants().contains(recipientId)) {
                List<ChatMessage> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId());
                return ConversationResponse.from(c, msgs, currentUserId);
            }
        }

        // Create new conversation
        String senderName = "Student";
        User sender = userRepository.findById(currentUserId).orElse(null);
        if (sender != null && sender.getName() != null) {
            senderName = sender.getName();
        }

        User recipient = userRepository.findById(recipientId).orElse(null);
        String recipientName = (recipient != null && recipient.getName() != null) ? recipient.getName() : "Student";

        Conversation conv = new Conversation();
        conv.getParticipants().add(currentUserId);
        conv.getParticipants().add(recipientId);
        conv.getParticipantNames().put(currentUserId, senderName);
        conv.getParticipantNames().put(recipientId, recipientName);
        conv.setName(recipientName);
        if (recipient != null && recipient.getDepartment() != null) {
            conv.setSubtitle(recipient.getDepartment() + (recipient.getYearOfStudy() != null ? " · Year " + recipient.getYearOfStudy() : ""));
        }
        conv.setLastMessage("");
        conv.setLastMessageAt(Instant.now());

        Conversation saved = conversationRepository.save(conv);
        return ConversationResponse.from(saved, Collections.emptyList(), currentUserId);
    }

    public MessageResponse sendMessage(String currentUserId, SendMessageRequest req) {
        String senderId = (currentUserId != null) ? currentUserId : "demo_user";
        String senderName = "Alex Chen";
        if (currentUserId != null) {
            User user = userRepository.findById(currentUserId).orElse(null);
            if (user != null && user.getName() != null) {
                senderName = user.getName();
            }
        }

        String recipientId = req.getRecipientId();
        if (recipientId == null || recipientId.trim().isEmpty()) {
            throw new BadRequestException("Recipient ID cannot be empty");
        }
        String content = req.getContent() != null ? req.getContent().trim() : "";

        // Find or create conversation
        Conversation conv = null;
        // Check if recipientId is a direct conversationId
        Optional<Conversation> byId = conversationRepository.findById(recipientId);
        if (byId.isPresent()) {
            conv = byId.get();
        } else {
            // Find existing conversation between sender and recipient
            List<Conversation> userConvs = conversationRepository.findByParticipantsContainingOrderByLastMessageAtDesc(senderId);
            for (Conversation c : userConvs) {
                if (c.getParticipants().contains(recipientId)) {
                    conv = c;
                    break;
                }
            }
        }

        if (conv == null) {
            conv = new Conversation();
            conv.getParticipants().add(senderId);
            conv.getParticipants().add(recipientId);
            conv.getParticipantNames().put(senderId, senderName);

            User recipientUser = userRepository.findById(recipientId).orElse(null);
            String recName = recipientUser != null && recipientUser.getName() != null
                    ? recipientUser.getName()
                    : recipientId;
            conv.getParticipantNames().put(recipientId, recName);
            conv.setName(recName);
            if (recipientUser != null && recipientUser.getDepartment() != null) {
                conv.setSubtitle(recipientUser.getDepartment() + (recipientUser.getYearOfStudy() != null ? " · Year " + recipientUser.getYearOfStudy() : ""));
            }
            conv = conversationRepository.save(conv);
        }

        ChatMessage msg = new ChatMessage();
        msg.setConversationId(conv.getId());
        msg.setSenderId(senderId);
        msg.setSenderName(senderName);
        msg.setRecipientId(recipientId);
        msg.setContent(content);
        msg.setCreatedAt(Instant.now());
        ChatMessage savedMsg = messageRepository.save(msg);

        conv.setLastMessage(content);
        conv.setLastMessageAt(Instant.now());
        conversationRepository.save(conv);

        return MessageResponse.from(savedMsg, senderId);
    }

    public void markRead(String conversationId, String currentUserId) {
        String uid = (currentUserId != null) ? currentUserId : "demo_user";
        conversationRepository.findById(conversationId).ifPresent(c -> {
            if (c.getUnreadCounts() != null) {
                c.getUnreadCounts().put(uid, 0);
                conversationRepository.save(c);
            }
        });
    }
}
