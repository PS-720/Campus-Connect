package com.campusconnect.community.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "communities")
public class Community {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String description;

    @Indexed
    private String category;

    private String icon;

    private String banner;

    private String createdBy;

    private Set<String> members = new HashSet<>();

    private Set<String> moderators = new HashSet<>();

    private List<String> tags = new ArrayList<>();

    private List<RuleItem> rules = new ArrayList<>();

    private boolean isPrivate = false;

    private int memberCount = 0;

    private int postCount = 0;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Community() {
    }

    public static class RuleItem {
        private int ruleNumber;
        private String title;
        private String description;

        public RuleItem() {
        }

        public RuleItem(int ruleNumber, String title, String description) {
            this.ruleNumber = ruleNumber;
            this.title = title;
            this.description = description;
        }

        public int getRuleNumber() {
            return ruleNumber;
        }

        public void setRuleNumber(int ruleNumber) {
            this.ruleNumber = ruleNumber;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Set<String> getMembers() {
        return members;
    }

    public void setMembers(Set<String> members) {
        this.members = members;
    }

    public Set<String> getModerators() {
        return moderators;
    }

    public void setModerators(Set<String> moderators) {
        this.moderators = moderators;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<RuleItem> getRules() {
        return rules;
    }

    public void setRules(List<RuleItem> rules) {
        this.rules = rules;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public int getPostCount() {
        return postCount;
    }

    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
