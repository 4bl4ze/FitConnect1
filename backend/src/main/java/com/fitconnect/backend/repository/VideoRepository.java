package com.fitconnect.backend.repository;

import com.fitconnect.backend.entity.YoutubeVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<YoutubeVideo, Long> {

    // Spring Data JPA dynamically generates this query based on the method name
    List<YoutubeVideo> findByCategoryIgnoreCase(String category);
}