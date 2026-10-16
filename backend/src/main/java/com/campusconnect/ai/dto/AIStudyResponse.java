package com.campusconnect.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class AIStudyResponse {
    private String intro;
    private String code;
    private List<String> keyPoints = new ArrayList<>();
    private List<String> followups = new ArrayList<>();

    public AIStudyResponse() {}

    public AIStudyResponse(String intro, String code, List<String> keyPoints, List<String> followups) {
        this.intro = intro;
        this.code = code;
        this.keyPoints = keyPoints;
        this.followups = followups;
    }

    public String getIntro() { return intro; }
    public void setIntro(String intro) { this.intro = intro; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public List<String> getKeyPoints() { return keyPoints; }
    public void setKeyPoints(List<String> keyPoints) { this.keyPoints = keyPoints; }
    public List<String> getFollowups() { return followups; }
    public void setFollowups(List<String> followups) { this.followups = followups; }
}
