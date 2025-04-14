package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.BillDto;
import com.roommate.expensemanager.dto.OcrResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface BillService {
    String storeImage(MultipartFile file);
    BillDto createBill(String imageUrl, Long roomId, String username);
    BillDto processOcrResult(Long billId, OcrResponseDto ocrResponse);
}