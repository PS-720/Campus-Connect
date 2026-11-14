package com.campusconnect.post.service;

import com.campusconnect.common.exception.BadRequestException;
import com.campusconnect.common.exception.ResourceNotFoundException;
import com.campusconnect.post.dto.CommentResponse;
import com.campusconnect.post.dto.CreateCommentRequest;
import com.campusconnect.post.dto.CreatePostRequest;
import com.campusconnect.post.dto.PostResponse;
import com.campusconnect.post.model.Comment;
import com.campusconnect.post.model.Post;
import com.campusconnect.post.repository.CommentRepository;
import com.campusconnect.post.repository.PostRepository;
import com.campusconnect.user.model.User;
import com.campusconnect.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final Path uploadDir = Paths.get("uploads", "posts");

    public PostService(
            PostRepository postRepository,
            CommentRepository commentRepository,
            UserRepository userRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException ignored) {
        }
    }

    public Map<String, Object> uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }
        try {
            String originalName = file.getOriginalFilename();
            String cleanName = originalName != null ? originalName.replaceAll("[^a-zA-Z0-9.-]", "_") : "file";
            String storedFilename = UUID.randomUUID() + "_" + cleanName;
            Path target = uploadDir.resolve(storedFilename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/api/v1/posts/media/" + storedFilename;
            Map<String, Object> result = new HashMap<>();
            result.put("url", fileUrl);
            result.put("filename", originalName);
            result.put("fileType", file.getContentType());
            result.put("size", file.getSize());
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store media file", e);
        }
    }

    public Resource loadMedia(String filename) {
        try {
            Path filePath = uploadDir.resolve(filename).normalize();
            if (!filePath.startsWith(uploadDir)) {
                throw new BadRequestException("Invalid file path");
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File not found: " + filename);
        }
    }

    public PostResponse createPost(String userId, CreatePostRequest request) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found with id: " + userId));

        Post post = new Post();
        post.setAuthorId(author.getId());
        post.setAuthorName(author.getName());
        post.setAuthorAvatar(author.getAvatar());
        post.setAuthorDepartment(author.getDepartment() != null ? author.getDepartment() : "General");
        post.setAuthorYearOfStudy(author.getYearOfStudy() != null ? author.getYearOfStudy() : 1);
        post.setContent(request.getContent().trim());

        if (request.getTags() != null) {
            post.setTags(request.getTags());
        }
        if (request.getMediaUrls() != null) {
            post.setMediaUrls(request.getMediaUrls());
        }
        if (request.getCommunityId() != null) {
            post.setCommunityId(request.getCommunityId());
        }

        Post saved = postRepository.save(post);
        return PostResponse.fromPost(saved, userId);
    }

    public List<PostResponse> getFeed(String currentUserId, String tag) {
        List<Post> posts;
        if (tag != null && !tag.trim().isEmpty() && !tag.equalsIgnoreCase("all")) {
            String cleanTag = tag.trim().replace("#", "");
            posts = postRepository.findByTagsContainingIgnoreCaseOrderByCreatedAtDesc(cleanTag);
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        }

        return posts.stream()
                .map(p -> PostResponse.fromPost(p, currentUserId))
                .toList();
    }

    public PostResponse getPostById(String postId, String currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        return PostResponse.fromPost(post, currentUserId);
    }

    public PostResponse toggleLike(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Set<String> likedBy = post.getLikedBy();
        if (likedBy == null) {
            likedBy = new HashSet<>();
        }

        if (likedBy.contains(userId)) {
            likedBy.remove(userId);
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        } else {
            likedBy.add(userId);
            post.setLikesCount(post.getLikesCount() + 1);
        }

        post.setLikedBy(likedBy);
        Post updated = postRepository.save(post);
        return PostResponse.fromPost(updated, userId);
    }

    public PostResponse toggleBookmark(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Set<String> bookmarkedBy = post.getBookmarkedBy();
        if (bookmarkedBy == null) {
            bookmarkedBy = new HashSet<>();
        }

        if (bookmarkedBy.contains(userId)) {
            bookmarkedBy.remove(userId);
        } else {
            bookmarkedBy.add(userId);
        }

        post.setBookmarkedBy(bookmarkedBy);
        Post updated = postRepository.save(post);
        return PostResponse.fromPost(updated, userId);
    }

    public CommentResponse addComment(String postId, String userId, CreateCommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Comment comment = new Comment();
        comment.setPostId(post.getId());
        comment.setAuthorId(author.getId());
        comment.setAuthorName(author.getName());
        comment.setAuthorAvatar(author.getAvatar());
        comment.setAuthorDepartment(author.getDepartment());
        comment.setContent(request.getContent().trim());

        Comment saved = commentRepository.save(comment);

        // Update post comment counter
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);

        return CommentResponse.fromComment(saved);
    }

    public List<CommentResponse> getComments(String postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }

        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(CommentResponse::fromComment)
                .toList();
    }

    public void deletePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getAuthorId().equals(userId)) {
            throw new BadRequestException("You can only delete your own posts");
        }

        commentRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }
}
