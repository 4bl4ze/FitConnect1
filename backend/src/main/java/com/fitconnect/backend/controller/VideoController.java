package com.fitconnect.backend.controller; // Added .backend

import com.fitconnect.backend.entity.YoutubeVideo; // Updated import
import com.fitconnect.backend.service.VideoRecommendationService; // Updated import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/videos")
@CrossOrigin(origins = "*")
public class VideoController {

    @Autowired
    private VideoRecommendationService recommendationService;

    @GetMapping("/recommendations")
    public ResponseEntity<List<YoutubeVideo>> getRecommendations(
            @RequestParam(required = false, defaultValue = "Warmup") String focus) {

        List<YoutubeVideo> videos = recommendationService.getRecommendationsForUser(focus);
        return ResponseEntity.ok(videos);
    }
}