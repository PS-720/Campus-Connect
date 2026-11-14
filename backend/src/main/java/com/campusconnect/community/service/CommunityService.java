package com.campusconnect.community.service;

import com.campusconnect.community.dto.CommunityResponse;
import com.campusconnect.community.dto.CreateCommunityRequest;
import com.campusconnect.community.model.Community;
import com.campusconnect.community.repository.CommunityRepository;
import com.campusconnect.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public CommunityService(CommunityRepository communityRepository, UserRepository userRepository) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }

    // ── Seeding ──────────────────────────────────────────────────────────────────

    @PostConstruct
    public void seedIfEmpty() {
        if (communityRepository.count() > 0) return;

        List<Community> seeds = new ArrayList<>();

        seeds.add(buildCommunity("AI & Machine Learning", "Explore the frontiers of artificial intelligence, deep learning, and data science with fellow enthusiasts.", "Technology", List.of("AI", "ML", "Python", "Data Science"), 1240));
        seeds.add(buildCommunity("Web Dev Hub", "From HTML to full-stack applications — share projects, resources, and code reviews for all web technologies.", "Technology", List.of("JavaScript", "React", "Node", "CSS"), 980));
        seeds.add(buildCommunity("Campus Entrepreneurs", "Connect with aspiring founders, share startup ideas, attend pitch events, and find your co-founder.", "Business", List.of("Startup", "Business", "Innovation", "Networking"), 756));
        seeds.add(buildCommunity("Photography Club", "A community for photographers of all skill levels. Share your shots, join photowalks, and get feedback.", "Arts", List.of("Photography", "Art", "Creative"), 512));
        seeds.add(buildCommunity("Research & Academia", "Discuss papers, share research findings, collaborate on projects and navigate grad school together.", "Academic", List.of("Research", "Science", "Publications"), 430));
        seeds.add(buildCommunity("Sports & Fitness", "Stay active together — organize games, share workout routines, and cheer for campus sports teams.", "Sports", List.of("Sports", "Fitness", "Health", "Cricket"), 890));

        communityRepository.saveAll(seeds);
    }

    private Community buildCommunity(String name, String desc, String category, List<String> tags, int members) {
        Community c = new Community();
        c.setName(name);
        c.setDescription(desc);
        c.setCategory(category);
        c.setTags(tags);
        c.setMemberCount(members);
        c.setPrivate(false);
        c.setCreatedAt(Instant.now());
        // Pre-seed mock member ids so count looks real
        for (int i = 0; i < Math.min(members, 50); i++) {
            c.getMembers().add("student_" + i);
        }
        return c;
    }

    // ── List ─────────────────────────────────────────────────────────────────────

    public List<CommunityResponse> listAll(String currentUserId) {
        return communityRepository.findAll()
                .stream()
                .map(c -> CommunityResponse.from(c, currentUserId))
                .collect(Collectors.toList());
    }

    public List<CommunityResponse> listByCategory(String category, String currentUserId) {
        return communityRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(c -> CommunityResponse.from(c, currentUserId))
                .collect(Collectors.toList());
    }

    public CommunityResponse getById(String id, String currentUserId) {
        Community c = communityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));
        return CommunityResponse.from(c, currentUserId);
    }

    // ── Create ───────────────────────────────────────────────────────────────────

    public CommunityResponse create(CreateCommunityRequest req, String creatorId) {
        if (communityRepository.existsByNameIgnoreCase(req.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A community with that name already exists");
        }
        Community c = new Community();
        c.setName(req.getName());
        c.setDescription(req.getDescription());
        c.setCategory(req.getCategory());
        c.setTags(req.getTags());
        c.setPrivate(req.isPrivate());
        c.setCreatedBy(creatorId);
        // Creator automatically becomes member + moderator
        c.getMembers().add(creatorId);
        c.getModerators().add(creatorId);
        c.setMemberCount(1);
        Community saved = communityRepository.save(c);

        if (creatorId != null) {
            userRepository.findById(creatorId).ifPresent(user -> {
                if (user.getJoinedCommunities() == null) {
                    user.setJoinedCommunities(new HashSet<>());
                }
                user.getJoinedCommunities().add(saved.getId());
                userRepository.save(user);
            });
        }

        return CommunityResponse.from(saved, creatorId);
    }

    // ── Membership ───────────────────────────────────────────────────────────────

    /**
     * Toggle membership for the given user. Returns the updated community.
     */
    public CommunityResponse toggleMembership(String communityId, String userId) {
        Community c = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        boolean wasMember = c.getMembers().contains(userId);
        if (wasMember) {
            c.getMembers().remove(userId);
            c.setMemberCount(Math.max(0, c.getMemberCount() - 1));
        } else {
            c.getMembers().add(userId);
            c.setMemberCount(c.getMemberCount() + 1);
        }
        Community saved = communityRepository.save(c);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                if (user.getJoinedCommunities() == null) {
                    user.setJoinedCommunities(new HashSet<>());
                }
                if (wasMember) {
                    user.getJoinedCommunities().remove(communityId);
                } else {
                    user.getJoinedCommunities().add(communityId);
                }
                userRepository.save(user);
            });
        }

        return CommunityResponse.from(saved, userId);
    }

    // ── Delete (admin/moderator only) ─────────────────────────────────────────────

    public void delete(String communityId, String requesterId) {
        Community c = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));
        if (!c.getCreatedBy().equals(requesterId) && !c.getModerators().contains(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not a moderator of this community");
        }
        communityRepository.delete(c);
    }
}
