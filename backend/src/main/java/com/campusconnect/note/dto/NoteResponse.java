package com.campusconnect.note.dto;

import com.campusconnect.note.model.Note;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class NoteResponse {

    private String id;
    private String code;
    private String title;
    private String description;
    private String department;
    private String semester;
    private AuthorDto author;
    private String date;
    private String rating;
    private int downloads;
    private int pages;
    private int likes;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private boolean isAiSummarized;
    private String aiSummary;
    private Instant createdAt;

    public static class AuthorDto {
        private String id;
        private String name;
        private String avatarText;
        private String avatarBg;

        public AuthorDto() {}

        public AuthorDto(String id, String name, String avatarText, String avatarBg) {
            this.id = id;
            this.name = name;
            this.avatarText = avatarText;
            this.avatarBg = avatarBg;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAvatarText() { return avatarText; }
        public void setAvatarText(String avatarText) { this.avatarText = avatarText; }
        public String getAvatarBg() { return avatarBg; }
        public void setAvatarBg(String avatarBg) { this.avatarBg = avatarBg; }
    }

    public NoteResponse() {
    }

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH).withZone(ZoneId.systemDefault());

    public static NoteResponse fromNote(Note note) {
        NoteResponse res = new NoteResponse();
        res.setId(note.getId());
        res.setCode(note.getCode() != null ? note.getCode() : (note.getSubject() != null ? note.getSubject() : "GEN101"));
        res.setTitle(note.getTitle());
        res.setDescription(note.getDescription());
        res.setDepartment(note.getDepartment() != null ? note.getDepartment() : (note.getBranch() != null ? note.getBranch() : "General"));
        
        String semStr = "Semester " + (note.getSemester() != null ? note.getSemester() : 1);
        if (note.getSemester() != null) {
            int s = note.getSemester();
            String suffix = (s == 1) ? "st" : (s == 2) ? "nd" : (s == 3) ? "rd" : "th";
            semStr = s + suffix + " Sem";
        }
        res.setSemester(semStr);

        String uploaderName = note.getUploaderName() != null ? note.getUploaderName() : "Student";
        String avatarLetter = uploaderName.substring(0, 1).toUpperCase();
        String[] colors = {"bg-[#10b981]", "bg-[#06b6d4]", "bg-[#f43f5e]", "bg-[#8b5cf6]", "bg-[#f59e0b]"};
        int colorIdx = Math.abs(uploaderName.hashCode()) % colors.length;
        res.setAuthor(new AuthorDto(note.getUploadedBy(), uploaderName, avatarLetter, colors[colorIdx]));

        if (note.getCreatedAt() != null) {
            res.setDate(DATE_FORMATTER.format(note.getCreatedAt()));
        } else {
            res.setDate("Recently");
        }

        res.setRating(note.getRating() > 0 ? String.format(Locale.ENGLISH, "%.1f", note.getRating()) : "5.0");
        res.setDownloads(note.getDownloads());
        res.setPages(note.getPages() > 0 ? note.getPages() : 12);
        res.setLikes(note.getLikes());
        res.setFileUrl(note.getFileUrl());
        res.setFileType(note.getFileType());
        res.setFileSize(note.getFileSize());
        res.setAiSummarized(note.isAiSummarized());
        res.setAiSummary(note.getAiSummary());
        res.setCreatedAt(note.getCreatedAt());

        return res;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public AuthorDto getAuthor() { return author; }
    public void setAuthor(AuthorDto author) { this.author = author; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    public int getDownloads() { return downloads; }
    public void setDownloads(int downloads) { this.downloads = downloads; }
    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }
    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public boolean isAiSummarized() { return isAiSummarized; }
    public void setAiSummarized(boolean aiSummarized) { isAiSummarized = aiSummarized; }
    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
