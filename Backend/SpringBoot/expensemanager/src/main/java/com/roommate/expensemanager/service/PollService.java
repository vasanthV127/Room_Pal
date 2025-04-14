package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.PollDto;
import com.roommate.expensemanager.dto.RecommendationDto;

import java.util.List;

public interface PollService {
    PollDto createPoll(PollDto pollDto, String username);
    PollDto addRecommendations(Long pollId, List<RecommendationDto> recommendations);
}