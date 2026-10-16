package com.campusconnect.note.service;

import com.campusconnect.common.exception.ResourceNotFoundException;
import com.campusconnect.note.dto.CreateNoteRequest;
import com.campusconnect.note.dto.NoteResponse;
import com.campusconnect.note.model.Note;
import com.campusconnect.note.repository.NoteRepository;
import com.campusconnect.user.model.User;
import com.campusconnect.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final Path uploadDir = Paths.get("uploads", "notes");

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            // Log directory creation warning
        }

        // Seed initial notes into MongoDB if empty
        if (noteRepository.count() == 0) {
            seedInitialNotes();
        }
    }

    private void seedInitialNotes() {
        List<Note> seeds = new ArrayList<>();

        Note n1 = new Note();
        n1.setCode("CS301");
        n1.setTitle("Data Structures & Algorithms — Complete Guide");
        n1.setDepartment("Computer Science");
        n1.setSubject("Data Structures");
        n1.setSemester(5);
        n1.setUploaderName("Dev Patel");
        n1.setRating(4.8);
        n1.setRatingCount(42);
        n1.setDownloads(342);
        n1.setPages(48);
        n1.setLikes(58);
        n1.setCreatedAt(Instant.now().minusSeconds(86400L * 15));
        seeds.add(n1);

        Note n2 = new Note();
        n2.setCode("EC402");
        n2.setTitle("Digital Signal Processing — Lecture Notes");
        n2.setDepartment("Electronics");
        n2.setSubject("Signal Processing");
        n2.setSemester(7);
        n2.setUploaderName("Priya Sharma");
        n2.setRating(4.6);
        n2.setRatingCount(28);
        n2.setDownloads(218);
        n2.setPages(32);
        n2.setLikes(34);
        n2.setCreatedAt(Instant.now().minusSeconds(86400L * 20));
        seeds.add(n2);

        Note n3 = new Note();
        n3.setCode("CS501");
        n3.setTitle("Machine Learning Fundamentals");
        n3.setDepartment("Computer Science");
        n3.setSubject("Machine Learning");
        n3.setSemester(6);
        n3.setUploaderName("Sara Liu");
        n3.setRating(4.9);
        n3.setRatingCount(65);
        n3.setDownloads(567);
        n3.setPages(64);
        n3.setLikes(92);
        n3.setCreatedAt(Instant.now().minusSeconds(86400L * 23));
        seeds.add(n3);

        Note n4 = new Note();
        n4.setCode("MA301");
        n4.setTitle("Engineering Mathematics III");
        n4.setDepartment("Mathematics");
        n4.setSubject("Mathematics");
        n4.setSemester(5);
        n4.setUploaderName("Kenji Tanaka");
        n4.setRating(4.5);
        n4.setRatingCount(31);
        n4.setDownloads(445);
        n4.setPages(56);
        n4.setLikes(49);
        n4.setCreatedAt(Instant.now().minusSeconds(86400L * 28));
        seeds.add(n4);

        Note n5 = new Note();
        n5.setCode("ME402");
        n5.setTitle("Thermodynamics & Heat Transfer");
        n5.setDepartment("Mechanical");
        n5.setSubject("Thermodynamics");
        n5.setSemester(7);
        n5.setUploaderName("Aisha Rahman");
        n5.setRating(4.7);
        n5.setRatingCount(39);
        n5.setDownloads(289);
        n5.setPages(40);
        n5.setLikes(41);
        n5.setCreatedAt(Instant.now().minusSeconds(86400L * 30));
        seeds.add(n5);

        Note n6 = new Note();
        n6.setCode("BU301");
        n6.setTitle("Corporate Finance & Valuation");
        n6.setDepartment("Business");
        n6.setSubject("Finance");
        n6.setSemester(5);
        n6.setUploaderName("Marcus Johnson");
        n6.setRating(4.4);
        n6.setRatingCount(22);
        n6.setDownloads(198);
        n6.setPages(36);
        n6.setLikes(25);
        n6.setCreatedAt(Instant.now().minusSeconds(86400L * 33));
        seeds.add(n6);

        noteRepository.saveAll(seeds);
    }

    public List<NoteResponse> listNotes(String department, String search) {
        List<Note> notes;
        if (department != null && !department.isBlank() && !"All".equalsIgnoreCase(department)) {
            notes = noteRepository.findByDepartmentIgnoreCaseOrderByCreatedAtDesc(department);
        } else {
            notes = noteRepository.findAllByOrderByCreatedAtDesc();
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            notes = notes.stream()
                    .filter(n -> (n.getTitle() != null && n.getTitle().toLowerCase().contains(q))
                            || (n.getCode() != null && n.getCode().toLowerCase().contains(q))
                            || (n.getDepartment() != null && n.getDepartment().toLowerCase().contains(q))
                            || (n.getDescription() != null && n.getDescription().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return notes.stream()
                .map(NoteResponse::fromNote)
                .collect(Collectors.toList());
    }

    public NoteResponse getNoteById(String id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        return NoteResponse.fromNote(note);
    }

    public NoteResponse createNote(String userId, CreateNoteRequest req, MultipartFile file) {
        String uploaderName = "Alex Chen";
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getName() != null) {
                uploaderName = user.getName();
            }
        }

        Note note = new Note();
        note.setCode(req.getCode() != null ? req.getCode().trim().toUpperCase() : "GEN101");
        note.setTitle(req.getTitle().trim());
        note.setDepartment(req.getDepartment() != null ? req.getDepartment() : "Computer Science");
        note.setBranch(req.getDepartment());
        note.setDescription(req.getDescription());

        // Parse semester string if given e.g. "5th Sem" or integer
        if (req.getSemester() != null) {
            try {
                String digits = req.getSemester().replaceAll("\\D+", "");
                if (!digits.isEmpty()) {
                    note.setSemester(Integer.parseInt(digits));
                }
            } catch (Exception ignored) {
                note.setSemester(1);
            }
        } else {
            note.setSemester(1);
        }

        note.setPages(req.getPages() != null && req.getPages() > 0 ? req.getPages() : 16);
        note.setUploadedBy(userId);
        note.setUploaderName(uploaderName);
        note.setRating(5.0);
        note.setRatingCount(1);
        note.setDownloads(0);
        note.setLikes(0);
        note.setCreatedAt(Instant.now());

        // Handle file
        if (file != null && !file.isEmpty()) {
            try {
                String originalName = file.getOriginalFilename();
                String storedFilename = UUID.randomUUID() + "_" + (originalName != null ? originalName : "note.pdf");
                Path target = uploadDir.resolve(storedFilename);
                Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

                note.setFileUrl("/api/v1/notes/files/" + storedFilename);
                note.setFileType(file.getContentType());
                note.setFileSize(file.getSize());
            } catch (IOException e) {
                throw new RuntimeException("Failed to store note file", e);
            }
        } else {
            note.setFileUrl(null);
            note.setFileType("application/pdf");
            note.setFileSize(1024L * 150); // 150 KB dummy size
        }

        Note saved = noteRepository.save(note);
        return NoteResponse.fromNote(saved);
    }

    public Resource downloadNote(String id, Note[] outNote) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));

        // Increment download counter
        note.setDownloads(note.getDownloads() + 1);
        noteRepository.save(note);

        if (outNote != null && outNote.length > 0) {
            outNote[0] = note;
        }

        if (note.getFileUrl() != null && note.getFileUrl().contains("/files/")) {
            String filename = note.getFileUrl().substring(note.getFileUrl().lastIndexOf("/") + 1);
            Path filePath = uploadDir.resolve(filename);
            if (Files.exists(filePath)) {
                try {
                    return new UrlResource(filePath.toUri());
                } catch (Exception ignored) {}
            }
        }

        // Return a generated summary document if physical file does not exist
        String content = "# " + note.getTitle() + "\n\n"
                + "Course: " + note.getCode() + "\n"
                + "Department: " + note.getDepartment() + "\n"
                + "Author: " + note.getUploaderName() + "\n\n"
                + "## Summary & Notes\n"
                + (note.getDescription() != null ? note.getDescription() : "Comprehensive course study material and lecture notes.") + "\n\n"
                + "Generated by Campus-Connect Academic Hub.\n";

        return new ByteArrayResource(content.getBytes(StandardCharsets.UTF_8));
    }

    public NoteResponse likeNote(String id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        note.setLikes(note.getLikes() + 1);
        return NoteResponse.fromNote(noteRepository.save(note));
    }

    public NoteResponse rateNote(String id, double rating) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        int count = note.getRatingCount() + 1;
        double currentTotal = note.getRating() * note.getRatingCount();
        double newRating = Math.round(((currentTotal + rating) / count) * 10.0) / 10.0;
        note.setRating(newRating);
        note.setRatingCount(count);
        return NoteResponse.fromNote(noteRepository.save(note));
    }

    public NoteResponse summarizeNote(String id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
        note.setAiSummarized(true);
        note.setAiSummary("AI Summary for " + note.getTitle() + ": Key topics include foundational theorems, step-by-step worked problems, and exam review notes.");
        return NoteResponse.fromNote(noteRepository.save(note));
    }

    public void deleteNote(String id) {
        if (!noteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note not found with id: " + id);
        }
        noteRepository.deleteById(id);
    }
}
