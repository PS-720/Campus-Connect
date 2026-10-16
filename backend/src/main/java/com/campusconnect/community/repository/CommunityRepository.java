package com.campusconnect.community.repository;

import com.campusconnect.community.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    Optional<Community> findByNameIgnoreCase(String name);
    List<Community> findByCategoryIgnoreCase(String category);
    boolean existsByNameIgnoreCase(String name);
}
