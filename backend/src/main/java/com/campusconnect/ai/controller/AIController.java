package com.campusconnect.ai.controller;

import com.campusconnect.ai.dto.*;
import com.campusconnect.ai.service.AIService;
import com.campusconnect.common.dto.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/study")
    public ResponseEntity<ApiResponse<AIStudyResponse>> studyQuery(@RequestBody AIStudyRequest request) {
        AIStudyResponse response = aiService.explainConcept(request.getSubject(), request.getQuery());
        return ResponseEntity.ok(ApiResponse.success("AI response generated", response));
    }

    @PostMapping(value = "/summarize", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ApiResponse<AISummarizeResponse>> summarizeFile(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "text", required = false) String text,
            @RequestParam(value = "fileName", required = false) String fileName) {
        AISummarizeResponse response = aiService.summarizeDocument(file, text, fileName);
        return ResponseEntity.ok(ApiResponse.success("Summary generated successfully", response));
    }

    @PostMapping(value = "/summarize", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<AISummarizeResponse>> summarizeJson(
            @RequestBody AIStudyRequest request) {
        AISummarizeResponse response = aiService.summarizeDocument(null, request.getQuery(), request.getSubject());
        return ResponseEntity.ok(ApiResponse.success("Summary generated successfully", response));
    }

    @PostMapping("/quiz")
    public ResponseEntity<ApiResponse<List<AIQuizQuestion>>> generateQuiz(@RequestBody AIQuizRequest request) {
        List<AIQuizQuestion> questions = aiService.generateQuiz(request);
        return ResponseEntity.ok(ApiResponse.success("Quiz generated successfully", questions));
    }
}
