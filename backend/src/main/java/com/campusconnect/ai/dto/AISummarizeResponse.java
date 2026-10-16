package com.campusconnect.ai.dto;

import java.util.ArrayList;
import java.util.List;

public class AISummarizeResponse {

    private String fileName;
    private String overview;
    private List<KeyConcept> keyConcepts = new ArrayList<>();
    private List<String> examFocus = new ArrayList<>();

    public static class KeyConcept {
        private String term;
        private String desc;

        public KeyConcept() {}
        public KeyConcept(String term, String desc) {
            this.term = term;
            this.desc = desc;
        }

        public String getTerm() { return term; }
        public void setTerm(String term) { this.term = term; }
        public String getDesc() { return desc; }
        public void setDesc(String desc) { this.desc = desc; }
    }

    public AISummarizeResponse() {}

    public AISummarizeResponse(String fileName, String overview, List<KeyConcept> keyConcepts, List<String> examFocus) {
        this.fileName = fileName;
        this.overview = overview;
        this.keyConcepts = keyConcepts;
        this.examFocus = examFocus;
    }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }
    public List<KeyConcept> getKeyConcepts() { return keyConcepts; }
    public void setKeyConcepts(List<KeyConcept> keyConcepts) { this.keyConcepts = keyConcepts; }
    public List<String> getExamFocus() { return examFocus; }
    public void setExamFocus(List<String> examFocus) { this.examFocus = examFocus; }
}
