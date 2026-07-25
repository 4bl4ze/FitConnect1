package com.fitconnect.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "youtube_videos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YoutubeVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "youtube_id", unique = true, nullable = false)
    private String youtubeId;

    @Column(nullable = false)
    private String title;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(nullable = false)
    private String category;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    // Helper method to automatically expose the full watch link in JSON responses
    public String getVideoUrl() {
        if (this.youtubeId == null || this.youtubeId.isEmpty()) {
            return null;
        }
        return "https://www.youtube.com/watch?v=" + this.youtubeId;
    }
}