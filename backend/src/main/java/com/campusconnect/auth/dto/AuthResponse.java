package com.campusconnect.auth.dto;

import com.campusconnect.user.model.User;

import java.util.List;
import java.util.Set;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
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

    public AuthResponse() {
    }

    public static AuthResponse of(String token, User user) {
        AuthResponse response = new AuthResponse();
        response.token = token;
        response.id = user.getId();
        response.name = user.getName();
        response.email = user.getEmail();
        response.role = user.getRole();
        response.avatar = user.getAvatar();
        response.university = user.getUniversity();
        response.department = user.getDepartment();
        response.yearOfStudy = user.getYearOfStudy();
        response.bio = user.getBio();
        response.skills = user.getSkills();
        response.interests = user.getInterests();
        response.joinedCommunities = user.getJoinedCommunities();
        response.bookmarkedNotes = user.getBookmarkedNotes();
        response.registeredEvents = user.getRegisteredEvents();
        return response;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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
}
