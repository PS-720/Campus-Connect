package com.campusconnect.chat.repository;

import com.campusconnect.chat.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipantsContainingOrderByLastMessageAtDesc(String userId);
    List<Conversation> findAllByOrderByLastMessageAtDesc();
}
