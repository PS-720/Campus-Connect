package com.campusconnect.event.dto;

import com.campusconnect.event.model.Event;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

public class EventResponse {

    private String id;
    private String title;
    private String description;
    private String category;
    private String date;
    private String time;
    private Instant startDate;
    private Instant endDate;
    private String location;
    private String venueType;
    private String organizer;
    private String createdBy;
    private String image;
    private int attendeesCount;
    private Integer maxParticipants;
    private boolean isRegistered;
    private String status;
    private List<String> tags;
    private Instant createdAt;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH).withZone(ZoneId.systemDefault());

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH).withZone(ZoneId.systemDefault());

    public EventResponse() {
    }

    public static EventResponse from(Event event, String currentUserId) {
        EventResponse res = new EventResponse();
        res.setId(event.getId());
        res.setTitle(event.getTitle());
        res.setDescription(event.getDescription());
        res.setCategory(event.getCategory() != null ? event.getCategory() : "General");
        res.setStartDate(event.getStartDate());
        res.setEndDate(event.getEndDate());
        res.setLocation(event.getLocation() != null ? event.getLocation() : "Campus Main");
        res.setVenueType(event.getVenueType() != null ? event.getVenueType() : "OFFLINE");
        res.setOrganizer(event.getOrganizer() != null ? event.getOrganizer() : "Campus Connect");
        res.setCreatedBy(event.getCreatedBy());
        res.setImage(event.getImage());
        res.setMaxParticipants(event.getMaxParticipants());
        res.setTags(event.getTags());
        res.setCreatedAt(event.getCreatedAt());

        int count = event.getRegisteredUsers() != null ? event.getRegisteredUsers().size() : 0;
        res.setAttendeesCount(count);

        if (currentUserId != null && event.getRegisteredUsers() != null) {
            res.setRegistered(event.getRegisteredUsers().contains(currentUserId));
        } else {
            res.setRegistered(false);
        }

        Instant eventDate = event.getStartDate() != null ? event.getStartDate() : event.getCreatedAt();
        if (eventDate != null) {
            res.setDate(DATE_FORMATTER.format(eventDate));
            res.setTime(TIME_FORMATTER.format(eventDate));
            if (event.getEndDate() != null && event.getEndDate().isBefore(Instant.now())) {
                res.setStatus("past");
            } else if (event.getStartDate() != null && event.getStartDate().isBefore(Instant.now())) {
                res.setStatus("ongoing");
            } else {
                res.setStatus("upcoming");
            }
        } else {
            res.setDate("Upcoming");
            res.setTime("TBD");
            res.setStatus("upcoming");
        }

        if (event.getStatus() != null && !event.getStatus().isBlank()) {
            res.setStatus(event.getStatus().toLowerCase());
        }

        return res;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }
    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getVenueType() { return venueType; }
    public void setVenueType(String venueType) { this.venueType = venueType; }
    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public int getAttendeesCount() { return attendeesCount; }
    public void setAttendeesCount(int attendeesCount) { this.attendeesCount = attendeesCount; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public boolean isRegistered() { return isRegistered; }
    public void setRegistered(boolean registered) { isRegistered = registered; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
