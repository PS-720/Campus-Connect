package com.campusconnect.chat.service;

import com.campusconnect.chat.dto.ConversationResponse;
import com.campusconnect.chat.dto.MessageResponse;
import com.campusconnect.chat.dto.SendMessageRequest;
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
        if (conversationRepository.count() == 0) {
            seedInitialConversations();
        }
    }

    private record SeedMsg(String sender, String text, int minsAgo) {}

    private void seedInitialConversations() {
        createSeedConversation("Priya Sharma", "priya_sharma", "Computer Science · 3rd Year",
                List.of(
                        new SeedMsg("priya_sharma", "Hey Alex! How is the project going?", 20),
                        new SeedMsg("alex_chen", "Going great, just finishing up the events page!", 15),
                        new SeedMsg("priya_sharma", "Did you see the hackathon announcement for next week?", 2)
                ));

        createSeedConversation("Coding Club", "coding_club", "1,247 members",
                List.of(
                        new SeedMsg("coding_club", "Reminder: Weekly open-source workshop is scheduled.", 60),
                        new SeedMsg("coding_club", "Meeting tomorrow at 5 PM in Room 304!", 15)
                ));

        createSeedConversation("Dev Patel", "dev_patel", "Computer Science · 5th Sem",
                List.of(
                        new SeedMsg("dev_patel", "Hey, can you share your algorithms guide?", 120),
                        new SeedMsg("alex_chen", "Sure thing, just uploaded it to the Notes section!", 80),
                        new SeedMsg("dev_patel", "Thanks for the notes!", 60)
                ));

        createSeedConversation("AI & Robotics Study Group", "ai_robotics_group", "856 members",
                List.of(
                        new SeedMsg("ai_robotics_group", "Marcus: Check out this paper on vision-language models for robot control!", 120)
                ));

        createSeedConversation("Sara Liu", "sara_liu", "Computer Science · 6th Sem",
                List.of(
                        new SeedMsg("sara_liu", "Are you free for the study session before the exam?", 180)
                ));

        createSeedConversation("Marcus Johnson", "marcus_j", "Electrical Eng. · 2nd Year",
                List.of(
                        new SeedMsg("marcus_j", "The PR is ready for review whenever you have a chance.", 300)
                ));
    }

    private void createSeedConversation(String name, String otherId, String subtitle, List<SeedMsg> seedMsgs) {
        Conversation c = new Conversation();
        c.setName(name);
        c.setSubtitle(subtitle);
        c.getParticipants().add("demo_user");
        c.getParticipants().add(otherId);
        c.getParticipantNames().put("demo_user", "Alex Chen");
        c.getParticipantNames().put(otherId, name);

        String lastMsg = "";
        Instant lastTime = Instant.now();

        Conversation saved = conversationRepository.save(c);

        for (SeedMsg item : seedMsgs) {
            String sender = item.sender();
            String text = item.text();
            int minsAgo = item.minsAgo();

            ChatMessage m = new ChatMessage();
            m.setConversationId(saved.getId());
            m.setSenderId("alex_chen".equals(sender) ? "demo_user" : otherId);
            m.setSenderName("alex_chen".equals(sender) ? "Alex Chen" : name);
            m.setRecipientId("alex_chen".equals(sender) ? otherId : "demo_user");
            m.setContent(text);
            m.setCreatedAt(Instant.now().minus(minsAgo, ChronoUnit.MINUTES));
            messageRepository.save(m);

            lastMsg = text;
            lastTime = m.getCreatedAt();
        }

        saved.setLastMessage(lastMsg);
        saved.setLastMessageAt(lastTime);
        conversationRepository.save(saved);
    }

    public List<ConversationResponse> listConversations(String currentUserId) {
        String uid = (currentUserId != null) ? currentUserId : "demo_user";
        List<Conversation> convs = conversationRepository.findAllByOrderByLastMessageAtDesc();

        List<ConversationResponse> result = new ArrayList<>();
        for (Conversation c : convs) {
            List<ChatMessage> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId());
            result.add(ConversationResponse.from(c, msgs, uid));
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
        String content = req.getContent().trim();

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
            conv.setName(recipientId);
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
