package com.campusconnect.community.dto;

import com.campusconnect.community.model.Community;

import java.time.Instant;
import java.util.List;

public class CommunityResponse {

    private String id;
    private String name;
    private String description;
    private String category;
    private String icon;
    private String banner;
    private List<String> tags;
    private int memberCount;
    private int postCount;
    private boolean isPrivate;
    private boolean isMember;        // relative to requesting user
    private boolean isModerator;     // relative to requesting user
    private String createdBy;
    private Instant createdAt;

    public CommunityResponse() {}

    /** Build a response DTO from a Community document and the requesting user's id. */
    public static CommunityResponse from(Community c, String currentUserId) {
        CommunityResponse r = new CommunityResponse();
        r.id = c.getId();
        r.name = c.getName();
        r.description = c.getDescription();
        r.category = c.getCategory();
        r.icon = c.getIcon();
        r.banner = c.getBanner();
        r.tags = c.getTags();
        r.memberCount = c.getMemberCount();
        r.postCount = c.getPostCount();
        r.isPrivate = c.isPrivate();
        r.createdBy = c.getCreatedBy();
        r.createdAt = c.getCreatedAt();
        if (currentUserId != null) {
            r.isMember = c.getMembers() != null && c.getMembers().contains(currentUserId);
            r.isModerator = c.getModerators() != null && c.getModerators().contains(currentUserId);
        }
        return r;
    }

    // ── Getters ──────────────────────────────────────────────────────────────────
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getIcon() { return icon; }
    public String getBanner() { return banner; }
    public List<String> getTags() { return tags; }
    public int getMemberCount() { return memberCount; }
    public int getPostCount() { return postCount; }
    public boolean isPrivate() { return isPrivate; }
    public boolean isMember() { return isMember; }
    public boolean isModerator() { return isModerator; }
    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }
}
