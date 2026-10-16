package com.campusconnect.community.service;

import com.campusconnect.community.dto.CommunityResponse;
import com.campusconnect.community.dto.CreateCommunityRequest;
import com.campusconnect.community.model.Community;
import com.campusconnect.community.repository.CommunityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
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
