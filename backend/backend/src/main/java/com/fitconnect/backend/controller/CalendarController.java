package com.fitconnect.backend.controller;

import com.fitconnect.backend.model.ScheduledWorkout; // Adjust package based on your project structure
import com.fitconnect.backend.service.CalendarService;   // Adjust package based on your project structure
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    // The frontend will call this to populate the calendar UI
    @GetMapping("/{userId}")
    public ResponseEntity<List<ScheduledWorkout>> getUserCalendar(
            @PathVariable("userId") Long userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ScheduledWorkout> schedule = calendarService.getSchedule(userId, startDate, endDate);

        return ResponseEntity.ok(schedule);
    }
}