package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.BillDto;
import com.roommate.expensemanager.service.BillService;
import com.roommate.expensemanager.service.OcrIntegrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    private final BillService billService;
    private final OcrIntegrationService ocrIntegrationService;

    public BillController(BillService billService, OcrIntegrationService ocrIntegrationService) {
        this.billService = billService;
        this.ocrIntegrationService = ocrIntegrationService;
    }

    @PostMapping("/upload")
    public ResponseEntity<BillDto> uploadBill(
            @RequestParam("file") MultipartFile file,
            @RequestParam("roomId") Long roomId,
            @RequestParam("username") String username) {
        String imageUrl = billService.storeImage(file);
        BillDto billDto = billService.createBill(imageUrl, roomId, username);
        ocrIntegrationService.processOcr(billDto.getId(), imageUrl);
        return ResponseEntity.ok(billDto);
    }
}