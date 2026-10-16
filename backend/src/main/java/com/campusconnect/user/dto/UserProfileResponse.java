package com.campusconnect.user.dto;

import com.campusconnect.user.model.User;
import java.time.Instant;
import java.util.List;
import java.util.Set;

public class UserProfileResponse {

    private String id;
    private String name;
    private String email;
    private String role;
    private String avatar;
    private String university;
    private String department;
    private Integer yearOfStudy;
    private String bio;
    private List<String> skills;
    private List<String> interests;
    private Set<String> joinedCommunities;
    private Set<String> bookmarkedNotes;
    private Set<String> registeredEvents;
    private Instant createdAt;

    public UserProfileResponse() {
    }

    public static UserProfileResponse fromUser(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAvatar(user.getAvatar());
        response.setUniversity(user.getUniversity());
        response.setDepartment(user.getDepartment());
        response.setYearOfStudy(user.getYearOfStudy());
        response.setBio(user.getBio());
        response.setSkills(user.getSkills());
        response.setInterests(user.getInterests());
        response.setJoinedCommunities(user.getJoinedCommunities());
        response.setBookmarkedNotes(user.getBookmarkedNotes());
        response.setRegisteredEvents(user.getRegisteredEvents());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public Set<String> getJoinedCommunities() {
        return joinedCommunities;
    }

    public void setJoinedCommunities(Set<String> joinedCommunities) {
        this.joinedCommunities = joinedCommunities;
    }

    public Set<String> getBookmarkedNotes() {
        return bookmarkedNotes;
    }

    public void setBookmarkedNotes(Set<String> bookmarkedNotes) {
        this.bookmarkedNotes = bookmarkedNotes;
    }

    public Set<String> getRegisteredEvents() {
        return registeredEvents;
    }

    public void setRegisteredEvents(Set<String> registeredEvents) {
        this.registeredEvents = registeredEvents;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
