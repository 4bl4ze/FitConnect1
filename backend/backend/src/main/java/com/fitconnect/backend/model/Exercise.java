package com.fitconnect.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Change these to String to accommodate ranges like "3-4" or "8-12"
    private String sets;
    private String reps;

    @JsonProperty("rest_seconds")
    private String restSeconds; // It is safer to change this to String too, in case AI returns "60-90s"
}