package com.campusconnect.ai.dto;

public class AIQuizRequest {
    private String subject;
    private String topic;
    private String difficulty = "Medium";
    private int questionCount = 5;

    public AIQuizRequest() {}

    public AIQuizRequest(String subject, String topic, String difficulty, int questionCount) {
        this.subject = subject;
        this.topic = topic;
        this.difficulty = difficulty;
        this.questionCount = questionCount;
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public int getQuestionCount() { return questionCount; }
    public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }
}
