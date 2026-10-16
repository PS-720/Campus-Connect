package com.campusconnect;

import com.campusconnect.auth.dto.AuthResponse;
import com.campusconnect.auth.dto.LoginRequest;
import com.campusconnect.auth.dto.RegisterRequest;
import com.campusconnect.common.dto.ApiResponse;
import com.campusconnect.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CampusConnectApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    private String getBaseUrl() {
        return "http://localhost:" + port + "/api/v1";
    }

    @BeforeEach
    void setUp() {
        userRepository.findByEmail("tester@campus.edu")
                .ifPresent(userRepository::delete);
    }

    @Test
    @DisplayName("Verify Health Endpoint and MongoDB Connection")
    void testHealthEndpoint() {
        ResponseEntity<ApiResponse<Map<String, Object>>> response = restTemplate.exchange(
                getBaseUrl() + "/health",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData().get("mongodb")).isEqualTo("UP");
    }

    @Test
    @DisplayName("Verify User Registration, Login, and JWT Token Authentication Flow")
    void testAuthWorkflow() {
        // 1. Register new user
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Test Student");
        registerReq.setEmail("tester@campus.edu");
        registerReq.setPassword("Password123!");
        registerReq.setUniversity("Tech University");
        registerReq.setDepartment("Computer Science");
        registerReq.setYearOfStudy(3);

        ResponseEntity<ApiResponse<AuthResponse>> registerRes = restTemplate.exchange(
                getBaseUrl() + "/auth/register",
                HttpMethod.POST,
                new HttpEntity<>(registerReq),
                new ParameterizedTypeReference<ApiResponse<AuthResponse>>() {}
        );

        assertThat(registerRes.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(registerRes.getBody()).isNotNull();
        assertThat(registerRes.getBody().isSuccess()).isTrue();
        AuthResponse registeredUser = registerRes.getBody().getData();
        assertThat(registeredUser.getToken()).isNotBlank();
        assertThat(registeredUser.getEmail()).isEqualTo("tester@campus.edu");

        // 2. Login
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("tester@campus.edu");
        loginReq.setPassword("Password123!");

        ResponseEntity<ApiResponse<AuthResponse>> loginRes = restTemplate.exchange(
                getBaseUrl() + "/auth/login",
                HttpMethod.POST,
                new HttpEntity<>(loginReq),
                new ParameterizedTypeReference<ApiResponse<AuthResponse>>() {}
        );

        assertThat(loginRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginRes.getBody()).isNotNull();
        assertThat(loginRes.getBody().isSuccess()).isTrue();
        String token = loginRes.getBody().getData().getToken();
        assertThat(token).isNotBlank();

        // 3. Test Protected endpoint /api/v1/auth/me with Bearer token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> authEntity = new HttpEntity<>(headers);

        ResponseEntity<ApiResponse<Map<String, Object>>> meRes = restTemplate.exchange(
                getBaseUrl() + "/auth/me",
                HttpMethod.GET,
                authEntity,
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );

        assertThat(meRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(meRes.getBody()).isNotNull();
        assertThat(meRes.getBody().isSuccess()).isTrue();
        assertThat(meRes.getBody().getData().get("email")).isEqualTo("tester@campus.edu");
    }

    @Test
    @DisplayName("Verify User Profile Retrieval, Editing, and Protected APIs")
    void testUserProfileWorkflow() {
        // 1. Register test user
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Jordan Lee");
        registerReq.setEmail("tester@campus.edu");
        registerReq.setPassword("Password123!");
        registerReq.setDepartment("Computer Science");
        registerReq.setYearOfStudy(2);

        ResponseEntity<ApiResponse<AuthResponse>> registerRes = restTemplate.exchange(
                getBaseUrl() + "/auth/register",
                HttpMethod.POST,
                new HttpEntity<>(registerReq),
                new ParameterizedTypeReference<ApiResponse<AuthResponse>>() {}
        );
        String token = registerRes.getBody().getData().getToken();
        String userId = registerRes.getBody().getData().getId();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        // 2. GET /api/v1/users/me (authenticated)
        ResponseEntity<ApiResponse<Map<String, Object>>> getProfileRes = restTemplate.exchange(
                getBaseUrl() + "/users/me",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(getProfileRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getProfileRes.getBody().getData().get("name")).isEqualTo("Jordan Lee");

        // 3. PUT /api/v1/users/me (update profile)
        Map<String, Object> updateReq = Map.of(
                "bio", "Passionate about full-stack engineering and AI",
                "university", "Stanford University",
                "skills", java.util.List.of("Java", "React", "MongoDB")
        );

        ResponseEntity<ApiResponse<Map<String, Object>>> updateRes = restTemplate.exchange(
                getBaseUrl() + "/users/me",
                HttpMethod.PUT,
                new HttpEntity<>(updateReq, headers),
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(updateRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateRes.getBody().getData().get("bio")).isEqualTo("Passionate about full-stack engineering and AI");
        assertThat(updateRes.getBody().getData().get("university")).isEqualTo("Stanford University");

        // 4. GET /api/v1/users/{id} (public profile check)
        ResponseEntity<ApiResponse<Map<String, Object>>> publicRes = restTemplate.exchange(
                getBaseUrl() + "/users/" + userId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(publicRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(publicRes.getBody().getData().get("university")).isEqualTo("Stanford University");

        // 5. Unauthenticated request to /api/v1/users/me should fail
        ResponseEntity<ApiResponse<Map<String, Object>>> unauthRes = restTemplate.exchange(
                getBaseUrl() + "/users/me",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(unauthRes.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("Verify Social Posts, Feed Retrieval, Likes, Comments, and Bookmarks")
    void testSocialPostsWorkflow() {
        // 1. Register test user
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Sam Postman");
        registerReq.setEmail("tester@campus.edu");
        registerReq.setPassword("Password123!");
        registerReq.setDepartment("Computer Science");
        registerReq.setYearOfStudy(3);

        ResponseEntity<ApiResponse<AuthResponse>> registerRes = restTemplate.exchange(
                getBaseUrl() + "/auth/register",
                HttpMethod.POST,
                new HttpEntity<>(registerReq),
                new ParameterizedTypeReference<ApiResponse<AuthResponse>>() {}
        );
        String token = registerRes.getBody().getData().getToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        // 2. Create a Post
        Map<String, Object> postReq = Map.of(
                "content", "Building an AI navigation system for campus!",
                "tags", java.util.List.of("Hackathon", "AI/ML")
        );
        ResponseEntity<ApiResponse<Map<String, Object>>> createPostRes = restTemplate.exchange(
                getBaseUrl() + "/posts",
                HttpMethod.POST,
                new HttpEntity<>(postReq, headers),
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(createPostRes.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Map<String, Object> postData = createPostRes.getBody().getData();
        String postId = (String) postData.get("id");
        assertThat(postId).isNotBlank();
        assertThat(postData.get("authorName")).isEqualTo("Sam Postman");

        // 3. Get Feed
        ResponseEntity<ApiResponse<java.util.List<Map<String, Object>>>> feedRes = restTemplate.exchange(
                getBaseUrl() + "/posts",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<ApiResponse<java.util.List<Map<String, Object>>>>() {}
        );
        assertThat(feedRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(feedRes.getBody().getData()).isNotEmpty();

        // 4. Like Post
        ResponseEntity<ApiResponse<Map<String, Object>>> likeRes = restTemplate.exchange(
                getBaseUrl() + "/posts/" + postId + "/like",
                HttpMethod.POST,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(likeRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(likeRes.getBody().getData().get("likesCount")).isEqualTo(1);
        assertThat(likeRes.getBody().getData().get("liked")).isEqualTo(true);

        // 5. Bookmark Post
        ResponseEntity<ApiResponse<Map<String, Object>>> bookmarkRes = restTemplate.exchange(
                getBaseUrl() + "/posts/" + postId + "/bookmark",
                HttpMethod.POST,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(bookmarkRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(bookmarkRes.getBody().getData().get("bookmarked")).isEqualTo(true);

        // 6. Add Comment
        Map<String, Object> commentReq = Map.of("content", "Awesome project, good luck!");
        ResponseEntity<ApiResponse<Map<String, Object>>> commentRes = restTemplate.exchange(
                getBaseUrl() + "/posts/" + postId + "/comments",
                HttpMethod.POST,
                new HttpEntity<>(commentReq, headers),
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
        assertThat(commentRes.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(commentRes.getBody().getData().get("content")).isEqualTo("Awesome project, good luck!");

        // 7. Get Comments
        ResponseEntity<ApiResponse<java.util.List<Map<String, Object>>>> getCommentsRes = restTemplate.exchange(
                getBaseUrl() + "/posts/" + postId + "/comments",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<ApiResponse<java.util.List<Map<String, Object>>>>() {}
        );
        assertThat(getCommentsRes.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getCommentsRes.getBody().getData()).hasSize(1);
    }
}
