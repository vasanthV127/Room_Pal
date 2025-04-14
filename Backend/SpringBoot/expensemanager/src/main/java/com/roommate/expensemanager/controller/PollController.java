package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.PollDto;
import com.roommate.expensemanager.service.PollService;
import com.roommate.expensemanager.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/polls")

public class PollController {
    private final PollService pollService;
    private final RecommendationService recommendationService;


    public PollController(PollService pollService, RecommendationService recommendationService) {
        this.pollService = pollService;
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public ResponseEntity<PollDto> createPoll(
            @RequestBody PollDto pollDto,
            @RequestParam String username) {
        return ResponseEntity.ok(pollService.createPoll(pollDto, username));
    }

    @PostMapping("/{id}/recommend")
    public ResponseEntity<PollDto> addRecommendations(
            @PathVariable Long id,
            @RequestParam String category) {
        var recommendations = recommendationService.getRecommendations(id, category);
        return ResponseEntity.ok(pollService.addRecommendations(id, recommendations));
    }
}