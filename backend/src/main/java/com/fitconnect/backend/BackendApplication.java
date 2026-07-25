package com.fitconnect.backend;

import com.fitconnect.backend.entity.YoutubeVideo;
import com.fitconnect.backend.repository.VideoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(VideoRepository videoRepository) {
		return args -> {
			// Clears old data so the database refreshes cleanly on boot
			videoRepository.deleteAll();

			// 1. Core Workout (Active video ID)
			YoutubeVideo coreVideo = YoutubeVideo.builder()
					.youtubeId("c6UIN0uDOgU")
					.title("10-Minute Deep Core Workout")
					.thumbnailUrl("https://img.youtube.com/vi/c6UIN0uDOgU/hqdefault.jpg")
					.category("Core")
					.difficultyLevel("Intermediate")
					.durationMinutes(10)
					.build();
			videoRepository.save(coreVideo);

			// 2. Warmup Workout / Fallback (Active video ID)
			YoutubeVideo warmupVideo = YoutubeVideo.builder()
					.youtubeId("_87SwEkoc8c")
					.title("5 Minute Warmup + Mobility Routine")
					.thumbnailUrl("https://img.youtube.com/vi/_87SwEkoc8c/hqdefault.jpg")
					.category("Warmup")
					.difficultyLevel("Beginner")
					.durationMinutes(5)
					.build();
			videoRepository.save(warmupVideo);
		};
	}

}