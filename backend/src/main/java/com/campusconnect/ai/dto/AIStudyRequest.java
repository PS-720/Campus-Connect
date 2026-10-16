package com.campusconnect.ai.dto;

public class AIStudyRequest {
    private String subject;
    private String query;

    public AIStudyRequest() {}

    public AIStudyRequest(String subject, String query) {
        this.subject = subject;
        this.query = query;
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
