package com.campusconnect.common.controller;

import com.campusconnect.common.dto.ApiResponse;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        boolean mongoConnected = false;
        String mongoStatus = "DOWN";

        try {
            mongoTemplate.executeCommand("{ ping: 1 }");
            mongoConnected = true;
            mongoStatus = "UP";
        } catch (Exception e) {
            mongoStatus = "DOWN: " + e.getMessage();
        }

        Map<String, Object> status = Map.of(
                "status", mongoConnected ? "UP" : "DEGRADED",
                "service", "CampusConnect Backend",
                "mongodb", mongoStatus,
                "timestamp", Instant.now()
        );

        return ResponseEntity.ok(ApiResponse.success("Health check completed", status));
    }
}
