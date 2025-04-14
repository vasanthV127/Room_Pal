package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.DebtDto;
import com.roommate.expensemanager.service.DebtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debts")
public class DebtController {
    private final DebtService debtService;

    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @PostMapping("/pay")
    public ResponseEntity<Void> payDebt(@RequestBody PayDebtRequest request) {
        debtService.payDebt(request.getDebtId());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<DebtDto>> getDebts(@RequestParam Long userId) {
        return ResponseEntity.ok(debtService.getDebts(userId));
    }

    private static class PayDebtRequest {
        private Long debtId;

        public Long getDebtId() {
            return debtId;
        }

        public void setDebtId(Long debtId) {
            this.debtId = debtId;
        }
    }
}