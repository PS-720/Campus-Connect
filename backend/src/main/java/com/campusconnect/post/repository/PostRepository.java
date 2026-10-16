package com.campusconnect.post.repository;

import com.campusconnect.post.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByTagsContainingIgnoreCaseOrderByCreatedAtDesc(String tag);

    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);

    List<Post> findByCommunityIdOrderByCreatedAtDesc(String communityId);

    List<Post> findByBookmarkedByContainingOrderByCreatedAtDesc(String userId);
}
