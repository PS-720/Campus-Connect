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
}
