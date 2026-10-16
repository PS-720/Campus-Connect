package com.campusconnect.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class AIQuizQuestion {

    private int id;
    private String question;
    private List<String> options = new ArrayList<>();
    private int correct;
    private String explanation;

    public AIQuizQuestion() {}

    public AIQuizQuestion(int id, String question, List<String> options, int correct, String explanation) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.correct = correct;
        this.explanation = explanation;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public int getCorrect() { return correct; }
    public void setCorrect(int correct) { this.correct = correct; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
