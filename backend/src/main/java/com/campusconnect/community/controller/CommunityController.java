package com.campusconnect.community.controller;

import com.campusconnect.community.dto.CommunityResponse;
import com.campusconnect.community.dto.CreateCommunityRequest;
import com.campusconnect.community.service.CommunityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/communities")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    // ── GET /api/v1/communities?category=Technology ─────────────────────────────
    @GetMapping
    public ResponseEntity<List<CommunityResponse>> list(
            @RequestParam(required = false) String category,
            Authentication auth) {

        String userId = auth != null ? auth.getName() : null;
        List<CommunityResponse> result = (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category))
                ? communityService.listByCategory(category, userId)
                : communityService.listAll(userId);
        return ResponseEntity.ok(result);
    }

    // ── GET /api/v1/communities/{id} ────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<CommunityResponse> getById(
            @PathVariable String id,
            Authentication auth) {

        String userId = auth != null ? auth.getName() : null;
        return ResponseEntity.ok(communityService.getById(id, userId));
    }

    // ── POST /api/v1/communities ────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<CommunityResponse> create(
            @RequestBody CreateCommunityRequest req,
            Authentication auth) {

        CommunityResponse created = communityService.create(req, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── POST /api/v1/communities/{id}/join ──────────────────────────────────────
    @PostMapping("/{id}/join")
    public ResponseEntity<CommunityResponse> toggleMembership(
            @PathVariable String id,
            Authentication auth) {

        return ResponseEntity.ok(communityService.toggleMembership(id, auth.getName()));
    }

    // ── DELETE /api/v1/communities/{id} ────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            Authentication auth) {

        communityService.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
