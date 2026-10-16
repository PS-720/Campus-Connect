package com.campusconnect.post.dto;

import com.campusconnect.post.model.Post;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

public class PostResponse {

    private String id;
    private String authorId;
    private String authorName;
    private String authorAvatar;
    private String authorDepartment;
    private Integer authorYearOfStudy;
    private String content;
    private List<String> mediaUrls;
    private List<String> tags;
    private String communityId;
    private int likesCount;
    private int commentsCount;
    private int sharesCount;
    private boolean isLiked;
    private boolean isBookmarked;
    private Instant createdAt;
    private String timeAgo;

    public PostResponse() {
    }

    public static PostResponse fromPost(Post post, String currentUserId) {
        PostResponse res = new PostResponse();
        res.setId(post.getId());
        res.setAuthorId(post.getAuthorId());
        res.setAuthorName(post.getAuthorName());
        res.setAuthorAvatar(post.getAuthorAvatar());
        res.setAuthorDepartment(post.getAuthorDepartment());
        res.setAuthorYearOfStudy(post.getAuthorYearOfStudy());
        res.setContent(post.getContent());
        res.setMediaUrls(post.getMediaUrls());
        res.setTags(post.getTags());
        res.setCommunityId(post.getCommunityId());
        res.setLikesCount(post.getLikesCount());
        res.setCommentsCount(post.getCommentsCount());
        res.setSharesCount(post.getSharesCount());
        res.setCreatedAt(post.getCreatedAt());

        if (currentUserId != null) {
            res.setLiked(post.getLikedBy() != null && post.getLikedBy().contains(currentUserId));
            res.setBookmarked(post.getBookmarkedBy() != null && post.getBookmarkedBy().contains(currentUserId));
        }

        res.setTimeAgo(calculateTimeAgo(post.getCreatedAt()));
        return res;
    }

    private static String calculateTimeAgo(Instant time) {
        if (time == null) return "Just now";
        Duration duration = Duration.between(time, Instant.now());
        long seconds = Math.max(0, duration.getSeconds());

        if (seconds < 60) {
            return "Just now";
        } else if (seconds < 3600) {
            return (seconds / 60) + "m ago";
        } else if (seconds < 86400) {
            return (seconds / 3600) + "h ago";
        } else {
            return (seconds / 86400) + "d ago";
        }
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorAvatar() {
        return authorAvatar;
    }

    public void setAuthorAvatar(String authorAvatar) {
        this.authorAvatar = authorAvatar;
    }

    public String getAuthorDepartment() {
        return authorDepartment;
    }

    public void setAuthorDepartment(String authorDepartment) {
        this.authorDepartment = authorDepartment;
    }

    public Integer getAuthorYearOfStudy() {
        return authorYearOfStudy;
    }

    public void setAuthorYearOfStudy(Integer authorYearOfStudy) {
        this.authorYearOfStudy = authorYearOfStudy;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getCommunityId() {
        return communityId;
    }

    public void setCommunityId(String communityId) {
        this.communityId = communityId;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    public int getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(int commentsCount) {
        this.commentsCount = commentsCount;
    }

    public int getSharesCount() {
        return sharesCount;
    }

    public void setSharesCount(int sharesCount) {
        this.sharesCount = sharesCount;
    }

    public boolean isLiked() {
        return isLiked;
    }

    public void setLiked(boolean liked) {
        isLiked = liked;
    }

    public boolean isBookmarked() {
        return isBookmarked;
    }

    public void setBookmarked(boolean bookmarked) {
        isBookmarked = bookmarked;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getTimeAgo() {
        return timeAgo;
    }

    public void setTimeAgo(String timeAgo) {
        this.timeAgo = timeAgo;
    }
}
