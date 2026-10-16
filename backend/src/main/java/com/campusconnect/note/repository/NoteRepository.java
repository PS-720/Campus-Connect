package com.campusconnect.note.repository;

import com.campusconnect.note.model.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends MongoRepository<Note, String> {
    List<Note> findBySubjectIgnoreCase(String subject);
    List<Note> findByBranchIgnoreCaseAndSemester(String branch, Integer semester);
    List<Note> findByUploadedBy(String uploadedBy);
    Page<Note> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description, Pageable pageable);
}
