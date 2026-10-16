package com.campusconnect.post.dto;

import com.campusconnect.post.model.Comment;

import java.time.Duration;
import java.time.Instant;

public class CommentResponse {

    private String id;
    private String postId;
    private String authorId;
    private String authorName;
    private String authorAvatar;
    private String authorDepartment;
    private String content;
    private Instant createdAt;
    private String timeAgo;

    public CommentResponse() {
    }

    public static CommentResponse fromComment(Comment comment) {
        CommentResponse res = new CommentResponse();
        res.setId(comment.getId());
        res.setPostId(comment.getPostId());
        res.setAuthorId(comment.getAuthorId());
        res.setAuthorName(comment.getAuthorName());
        res.setAuthorAvatar(comment.getAuthorAvatar());
        res.setAuthorDepartment(comment.getAuthorDepartment());
        res.setContent(comment.getContent());
        res.setCreatedAt(comment.getCreatedAt());

        if (comment.getCreatedAt() != null) {
            Duration duration = Duration.between(comment.getCreatedAt(), Instant.now());
            long seconds = Math.max(0, duration.getSeconds());
            if (seconds < 60) {
                res.setTimeAgo("Just now");
            } else if (seconds < 3600) {
                res.setTimeAgo((seconds / 60) + "m ago");
            } else if (seconds < 86400) {
                res.setTimeAgo((seconds / 3600) + "h ago");
            } else {
                res.setTimeAgo((seconds / 86400) + "d ago");
            }
        } else {
            res.setTimeAgo("Just now");
        }

        return res;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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
