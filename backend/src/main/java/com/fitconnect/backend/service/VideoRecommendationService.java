package com.fitconnect.backend.service; // Added .backend

import com.fitconnect.backend.entity.YoutubeVideo; // Updated import
import com.fitconnect.backend.repository.VideoRepository; // Updated import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VideoRecommendationService {

    @Autowired
    private VideoRepository videoRepository;

    public List<YoutubeVideo> getRecommendationsForUser(String focusArea) {
        List<YoutubeVideo> recommended = videoRepository.findByCategoryIgnoreCase(focusArea);

        // Fallback strategy: If no specific workouts match, return standard warmups
        if (recommended.isEmpty()) {
            return videoRepository.findByCategoryIgnoreCase("Warmup");
        }

        return recommended;
    }
}