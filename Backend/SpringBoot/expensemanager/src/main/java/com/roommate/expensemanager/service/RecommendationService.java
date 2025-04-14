package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.RecommendationDto;

import java.util.List;

public interface RecommendationService {
    List<RecommendationDto> getRecommendations(Long pollId, String category);
}