package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.OcrResponseDto;
import com.roommate.expensemanager.exception.OcrServiceException;
import com.roommate.expensemanager.service.BillService;
import com.roommate.expensemanager.service.OcrIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service

public class OcrIntegrationServiceImpl implements OcrIntegrationService {
    private final RestTemplate restTemplate;
    private final BillService billService;
    private final String ocrServiceUrl;

    public OcrIntegrationServiceImpl(
            RestTemplate restTemplate,
            BillService billService,
            @Value("${python.ocr.service.url}") String ocrServiceUrl) {
        this.restTemplate = restTemplate;
        this.billService = billService;
        this.ocrServiceUrl = ocrServiceUrl;
    }

    @Override
    public void processOcr(Long billId, String imageUrl) {
        try {
            OcrResponseDto response = restTemplate.postForObject(
                    ocrServiceUrl,
                    new OcrRequest(imageUrl),
                    OcrResponseDto.class
            );
            if (response != null) {
                billService.processOcrResult(billId, response);
            }
        } catch (Exception e) {
            throw new OcrServiceException("Failed to process OCR: " + e.getMessage());
        }
    }

    private static class OcrRequest {
        private String imageUrl;

        public OcrRequest(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
    }
}