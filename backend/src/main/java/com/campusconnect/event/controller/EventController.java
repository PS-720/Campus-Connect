package com.campusconnect.event.controller;

import com.campusconnect.common.dto.ApiResponse;
import com.campusconnect.event.dto.CreateEventRequest;
import com.campusconnect.event.dto.EventResponse;
import com.campusconnect.event.service.EventService;
import com.campusconnect.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> listEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : null;
        List<EventResponse> events = eventService.listEvents(category, status, userId);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : null;
        EventResponse event = eventService.getEventById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Event retrieved successfully", event));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody CreateEventRequest request) {
        String userId = currentUser != null ? currentUser.getId() : null;
        EventResponse event = eventService.createEvent(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", event));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<EventResponse>> registerForEvent(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : "demo_user";
        EventResponse event = eventService.registerForEvent(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Successfully registered for event", event));
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<ApiResponse<EventResponse>> unregisterFromEvent(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String userId = currentUser != null ? currentUser.getId() : "demo_user";
        EventResponse event = eventService.unregisterFromEvent(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Successfully unregistered from event", event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
