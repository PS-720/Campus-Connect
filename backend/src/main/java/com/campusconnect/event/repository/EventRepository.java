package com.campusconnect.event.repository;

import com.campusconnect.event.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByCategoryIgnoreCase(String category);
    List<Event> findByStatusIgnoreCase(String status);
    List<Event> findByStartDateAfterOrderByStartDateAsc(Instant date);
}
