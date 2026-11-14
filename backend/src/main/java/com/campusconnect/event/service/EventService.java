package com.campusconnect.event.service;

import com.campusconnect.common.exception.ResourceNotFoundException;
import com.campusconnect.event.dto.CreateEventRequest;
import com.campusconnect.event.dto.EventResponse;
import com.campusconnect.event.model.Event;
import com.campusconnect.event.repository.EventRepository;
import com.campusconnect.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        if (eventRepository.count() == 0) {
            seedInitialEvents();
        }
    }

    private void seedInitialEvents() {
        List<Event> seeds = new ArrayList<>();

        Event e1 = new Event();
        e1.setTitle("HackMIT 2025");
        e1.setCategory("Hackathon");
        e1.setDescription("Annual 24-hour collegiate hackathon bringing together students to build groundbreaking tech projects.");
        e1.setLocation("Main Auditorium");
        e1.setVenueType("OFFLINE");
        e1.setOrganizer("MIT Tech Club");
        e1.setStartDate(Instant.now().plus(7, ChronoUnit.DAYS));
        e1.setEndDate(Instant.now().plus(8, ChronoUnit.DAYS));
        e1.setStatus("upcoming");
        e1.setImage("hackathon");
        e1.setMaxParticipants(500);
        e1.setTags(List.of("Hackathon", "Coding", "AI", "Hardware"));
        e1.setCreatedAt(Instant.now());
        // pre-seed mock registered users count
        for (int i = 0; i < 342; i++) {
            e1.getRegisteredUsers().add("student_" + i);
        }
        seeds.add(e1);

        Event e2 = new Event();
        e2.setTitle("AI Workshop Series: LLMs");
        e2.setCategory("Workshop");
        e2.setDescription("Hands-on workshop exploring prompt engineering, fine-tuning open-source models, and agent architectures.");
        e2.setLocation("CS Lab 204");
        e2.setVenueType("HYBRID");
        e2.setOrganizer("AI Research Society");
        e2.setStartDate(Instant.now().plus(10, ChronoUnit.DAYS));
        e2.setEndDate(Instant.now().plus(10, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS));
        e2.setStatus("upcoming");
        e2.setImage("robotics");
        e2.setMaxParticipants(100);
        e2.setTags(List.of("AI", "MachineLearning", "Python"));
        e2.setCreatedAt(Instant.now());
        for (int i = 0; i < 80; i++) {
            e2.getRegisteredUsers().add("student_" + i);
        }
        seeds.add(e2);

        Event e3 = new Event();
        e3.setTitle("Annual Career Fair 2025");
        e3.setCategory("Career");
        e3.setDescription("Connect with over 150 top technology, finance, and engineering employers for internships and full-time roles.");
        e3.setLocation("Campus Grounds");
        e3.setVenueType("OFFLINE");
        e3.setOrganizer("Campus Career Services");
        e3.setStartDate(Instant.now().plus(14, ChronoUnit.DAYS));
        e3.setEndDate(Instant.now().plus(14, ChronoUnit.DAYS).plus(8, ChronoUnit.HOURS));
        e3.setStatus("upcoming");
        e3.setImage("business");
        e3.setMaxParticipants(2000);
        e3.setTags(List.of("Career", "Jobs", "Internships", "Networking"));
        e3.setCreatedAt(Instant.now());
        for (int i = 0; i < 1200; i++) {
            e3.getRegisteredUsers().add("student_" + i);
        }
        seeds.add(e3);

        Event e4 = new Event();
        e4.setTitle("Photography Exhibition");
        e4.setCategory("Cultural");
        e4.setDescription("Showcase of student fine-art photography exploring urban architecture, campus life, and wildlife.");
        e4.setLocation("Art Gallery");
        e4.setVenueType("OFFLINE");
        e4.setOrganizer("Arts & Camera Club");
        e4.setStartDate(Instant.now().plus(18, ChronoUnit.DAYS));
        e4.setEndDate(Instant.now().plus(20, ChronoUnit.DAYS));
        e4.setStatus("upcoming");
        e4.setImage("camera");
        e4.setMaxParticipants(600);
        e4.setTags(List.of("Photography", "Art", "Culture"));
        e4.setCreatedAt(Instant.now());
        for (int i = 0; i < 450; i++) {
            e4.getRegisteredUsers().add("student_" + i);
        }
        seeds.add(e4);

        Event e5 = new Event();
        e5.setTitle("Inter-College Cricket Tournament");
        e5.setCategory("Sports");
        e5.setDescription("The premier inter-collegiate cricket tournament featuring 16 competing university teams.");
        e5.setLocation("Sports Complex");
        e5.setVenueType("OFFLINE");
        e5.setOrganizer("Sports Department");
        e5.setStartDate(Instant.now().plus(22, ChronoUnit.DAYS));
        e5.setEndDate(Instant.now().plus(25, ChronoUnit.DAYS));
        e5.setStatus("upcoming");
        e5.setImage("sports");
        e5.setMaxParticipants(1000);
        e5.setTags(List.of("Sports", "Cricket", "Athletics"));
        e5.setCreatedAt(Instant.now());
        for (int i = 0; i < 600; i++) {
            e5.getRegisteredUsers().add("student_" + i);
        }
        seeds.add(e5);

        eventRepository.saveAll(seeds);
    }

    public List<EventResponse> listEvents(String category, String status, String currentUserId) {
        List<Event> events;
        if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
            events = eventRepository.findByCategoryIgnoreCase(category);
        } else {
            events = eventRepository.findAll();
        }

        List<EventResponse> responses = events.stream()
                .map(e -> EventResponse.from(e, currentUserId))
                .collect(Collectors.toList());

        if (status != null && !status.isBlank()) {
            String s = status.toLowerCase();
            if ("registered".equals(s)) {
                responses = responses.stream().filter(EventResponse::isRegistered).collect(Collectors.toList());
            } else if ("upcoming".equals(s) || "past".equals(s)) {
                responses = responses.stream().filter(e -> s.equalsIgnoreCase(e.getStatus())).collect(Collectors.toList());
            }
        }

        return responses;
    }

    public EventResponse getEventById(String id, String currentUserId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return EventResponse.from(event, currentUserId);
    }

    public EventResponse createEvent(CreateEventRequest req, String userId) {
        Event event = new Event();
        event.setTitle(req.getTitle().trim());
        event.setDescription(req.getDescription());
        event.setCategory(req.getCategory() != null ? req.getCategory() : "General");
        event.setStartDate(req.getStartDate() != null ? req.getStartDate() : Instant.now().plus(7, ChronoUnit.DAYS));
        event.setEndDate(req.getEndDate());
        event.setLocation(req.getLocation() != null ? req.getLocation() : "Campus");
        event.setVenueType(req.getVenueType() != null ? req.getVenueType() : "OFFLINE");
        event.setOrganizer(req.getOrganizer() != null ? req.getOrganizer() : "Campus Community");
        event.setImage(req.getImage());
        event.setMaxParticipants(req.getMaxParticipants());
        event.setTags(req.getTags());
        event.setCreatedBy(userId);
        event.setStatus("upcoming");
        event.setCreatedAt(Instant.now());

        if (userId != null) {
            event.getRegisteredUsers().add(userId);
        }

        Event saved = eventRepository.save(event);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                if (user.getRegisteredEvents() == null) {
                    user.setRegisteredEvents(new HashSet<>());
                }
                user.getRegisteredEvents().add(saved.getId());
                userRepository.save(user);
            });
        }

        return EventResponse.from(saved, userId);
    }

    public EventResponse registerForEvent(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getRegisteredUsers() == null) {
            event.setRegisteredUsers(new HashSet<>());
        }
        event.getRegisteredUsers().add(userId);
        Event saved = eventRepository.save(event);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                if (user.getRegisteredEvents() == null) {
                    user.setRegisteredEvents(new HashSet<>());
                }
                user.getRegisteredEvents().add(eventId);
                userRepository.save(user);
            });
        }

        return EventResponse.from(saved, userId);
    }

    public EventResponse unregisterFromEvent(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getRegisteredUsers() != null) {
            event.getRegisteredUsers().remove(userId);
        }
        Event saved = eventRepository.save(event);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                if (user.getRegisteredEvents() != null) {
                    user.getRegisteredEvents().remove(eventId);
                    userRepository.save(user);
                }
            });
        }

        return EventResponse.from(saved, userId);
    }

    public void deleteEvent(String eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }
}
