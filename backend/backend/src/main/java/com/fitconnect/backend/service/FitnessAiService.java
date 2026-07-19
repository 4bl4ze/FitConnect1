package com.fitconnect.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitconnect.backend.model.PhysiqueAnalysis; // Fixed Import: Using the Entity
import com.fitconnect.backend.model.WorkoutPlan;
import com.fitconnect.backend.repository.PhysiqueAnalysisRepository; // Fixed Import: Using the Repository
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@RequiredArgsConstructor
public class FitnessAiService {

    private final ObjectMapper objectMapper;
    private final PhysiqueAnalysisRepository physiqueAnalysisRepository;

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String MODEL_NAME = "gemini-3.5-flash";

    public WorkoutPlan generateWorkoutPlan(String goal, String experienceLevel, int daysPerWeek) {
        String prompt = String.format(
                "Act as an expert fitness coach. Create a %d-day workout plan for a %s level user whose primary goal is %s. " +
                        "Return the response strictly as a JSON object containing a 'plan_name', 'days_per_week', and an array of 'workouts' (with day, focus, and an array of exercises).",
                daysPerWeek, experienceLevel, goal
        );

        String requestBody = "{"
                + "\"contents\": [{ \"parts\": [{\"text\": \"" + prompt + "\"}]}],"
                + "\"generationConfig\": {\"responseMimeType\": \"application/json\"}"
                + "}";

        try {
            return sendRequest(requestBody, WorkoutPlan.class);
        } catch (Exception e) {
            throw new RuntimeException("Workout generation failed: " + e.getMessage());
        }
    }

    public String analyzePhysique(Long userId, MultipartFile imageFile) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());
            String mimeType = imageFile.getContentType();

            String prompt = "You are a professional fitness coach. Analyze this physique image. " +
                    "Provide an encouraging assessment of current body composition, " +
                    "and suggest a general workout focus (e.g., hypertrophy, cutting, core stabilization).";

            String requestBody = String.format(
                    "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}, {\"inline_data\": {\"mime_type\": \"%s\", \"data\": \"%s\"}}]}]}",
                    prompt, mimeType, base64Image
            );

            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent?key=" + apiKey;

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("GEMINI API RESPONSE: " + response.body());

            String aiResult = parseGeminiResponse(response.body());

            // --- PERSISTENCE: BUILDING THE ENTITY CORRECTLY ---
            PhysiqueAnalysis analysis = PhysiqueAnalysis.builder()
                    .userId(userId)
                    .aiRawResponse(aiResult)
                    .build();

            physiqueAnalysisRepository.save(analysis);

            return aiResult;

        } catch (Exception e) {
            throw new RuntimeException("AI Image analysis failed: " + e.getMessage());
        }
    }

    private <T> T sendRequest(String requestBody, Class<T> responseType) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent?key=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("GEMINI API RESPONSE: " + response.body());

        String text = parseGeminiResponse(response.body());
        return objectMapper.readValue(text, responseType);
    }

    private String parseGeminiResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);

        if (root.has("error")) {
            throw new RuntimeException("Gemini API returned error: " + root.path("error").path("message").asText());
        }

        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && candidates.size() > 0) {
            JsonNode part = candidates.get(0).path("content").path("parts").get(0);
            if (part.has("text")) {
                return part.get("text").asText();
            }
        }

        throw new RuntimeException("Gemini returned an empty or unexpected response structure.");
    }
}