package com.campusconnect.note.controller;

import com.campusconnect.common.dto.ApiResponse;
import com.campusconnect.note.dto.CreateNoteRequest;
import com.campusconnect.note.dto.NoteResponse;
import com.campusconnect.note.model.Note;
import com.campusconnect.note.service.NoteService;
import com.campusconnect.security.UserPrincipal;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteResponse>>> listNotes(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String search) {
        List<NoteResponse> notes = noteService.listNotes(department, search);
        return ResponseEntity.ok(ApiResponse.success("Notes retrieved successfully", notes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(@PathVariable String id) {
        NoteResponse note = noteService.getNoteById(id);
        return ResponseEntity.ok(ApiResponse.success("Note retrieved successfully", note));
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ApiResponse<NoteResponse>> uploadNote(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @ModelAttribute CreateNoteRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        String userId = currentUser != null ? currentUser.getId() : null;
        NoteResponse note = noteService.createNote(userId, request, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Note uploaded successfully", note));
    }

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<ApiResponse<NoteResponse>> createNoteJson(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody CreateNoteRequest request) {
        String userId = currentUser != null ? currentUser.getId() : null;
        NoteResponse note = noteService.createNote(userId, request, null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Note created successfully", note));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadNote(@PathVariable String id) {
        Note[] holder = new Note[1];
        Resource resource = noteService.downloadNote(id, holder);
        Note note = holder[0];

        String filename = (note != null && note.getTitle() != null)
                ? note.getTitle().replaceAll("[^a-zA-Z0-9.-]", "_") + ".txt"
                : "note_" + id + ".txt";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<NoteResponse>> likeNote(@PathVariable String id) {
        NoteResponse note = noteService.likeNote(id);
        return ResponseEntity.ok(ApiResponse.success("Note liked successfully", note));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<ApiResponse<NoteResponse>> rateNote(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        double rating = 5.0;
        if (body != null && body.get("rating") instanceof Number num) {
            rating = num.doubleValue();
        }
        NoteResponse note = noteService.rateNote(id, rating);
        return ResponseEntity.ok(ApiResponse.success("Note rated successfully", note));
    }

    @PostMapping("/{id}/summarize")
    public ResponseEntity<ApiResponse<NoteResponse>> summarizeNote(@PathVariable String id) {
        NoteResponse note = noteService.summarizeNote(id);
        return ResponseEntity.ok(ApiResponse.success("Note summarized successfully", note));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable String id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.success("Note deleted successfully", null));
    }
}
