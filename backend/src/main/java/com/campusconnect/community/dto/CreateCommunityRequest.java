package com.campusconnect.community.dto;

import java.util.List;

public class CreateCommunityRequest {

    private String name;
    private String description;
    private String category;
    private List<String> tags;
    private boolean isPrivate;

    public CreateCommunityRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public boolean isPrivate() { return isPrivate; }
    public void setPrivate(boolean aPrivate) { isPrivate = aPrivate; }
}
