package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.RecommendationDto;
import com.roommate.expensemanager.exception.RecommendationException;
import com.roommate.expensemanager.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {
    private final RestTemplate restTemplate;
    private final String recommendationServiceUrl;

    public RecommendationServiceImpl(
            RestTemplate restTemplate,
            @Value("${python.recommendation.service.url}") String recommendationServiceUrl) {
        this.restTemplate = restTemplate;
        this.recommendationServiceUrl = recommendationServiceUrl;
    }

    @Override
    public List<RecommendationDto> getRecommendations(Long pollId, String category) {
        try {
            RecommendationRequest request = new RecommendationRequest(pollId, category);
            RecommendationDto[] response = restTemplate.postForObject(
                    recommendationServiceUrl,
                    request,
                    RecommendationDto[].class
            );
            return response != null ? Arrays.asList(response) : List.of();
        } catch (Exception e) {
            throw new RecommendationException("Failed to fetch recommendations: " + e.getMessage());
        }
    }

    private static class RecommendationRequest {
        private Long pollId;
        private String category;

        public RecommendationRequest(Long pollId, String category) {
            this.pollId = pollId;
            this.category = category;
        }

        public Long getPollId() {
            return pollId;
        }

        public void setPollId(Long pollId) {
            this.pollId = pollId;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }
}