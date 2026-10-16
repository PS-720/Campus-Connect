package com.campusconnect.post.repository;

import com.campusconnect.post.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);

    long countByPostId(String postId);

    void deleteByPostId(String postId);
}
