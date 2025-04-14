package com.roommate.expensemanager.service;

public interface OcrIntegrationService {
    void processOcr(Long billId, String imageUrl);
}