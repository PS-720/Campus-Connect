package com.campusconnect.post.controller;

import com.campusconnect.common.dto.ApiResponse;
import com.campusconnect.post.dto.CommentResponse;
import com.campusconnect.post.dto.CreateCommentRequest;
import com.campusconnect.post.dto.CreatePostRequest;
import com.campusconnect.post.dto.PostResponse;
import com.campusconnect.post.service.PostService;
import com.campusconnect.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponse>>> getFeed(
            @RequestParam(required = false) String tag,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String currentUserId = currentUser != null ? currentUser.getId() : null;
        List<PostResponse> feed = postService.getFeed(currentUserId, tag);
        return ResponseEntity.ok(ApiResponse.success("Feed retrieved successfully", feed));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreatePostRequest request) {
        PostResponse post = postService.createPost(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created successfully", post));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String currentUserId = currentUser != null ? currentUser.getId() : null;
        PostResponse post = postService.getPostById(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Post retrieved successfully", post));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<PostResponse>> toggleLike(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        PostResponse post = postService.toggleLike(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Like updated successfully", post));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse<PostResponse>> toggleBookmark(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        PostResponse post = postService.toggleBookmark(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Bookmark updated successfully", post));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable String id) {
        List<CommentResponse> comments = postService.getComments(id);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved successfully", comments));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse comment = postService.addComment(id, currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added successfully", comment));
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadMedia(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = postService.uploadFile(file);
        return ResponseEntity.ok(ApiResponse.success("Media uploaded successfully", result));
    }

    @GetMapping("/media/{filename:.+}")
    public ResponseEntity<Resource> getMedia(@PathVariable String filename) {
        Resource resource = postService.loadMedia(filename);
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try {
            Path path = Paths.get("uploads", "posts", filename);
            String probeType = Files.probeContentType(path);
            if (probeType != null) {
                mediaType = MediaType.parseMediaType(probeType);
            }
        } catch (Exception ignored) {
        }
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        postService.deletePost(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }
}
