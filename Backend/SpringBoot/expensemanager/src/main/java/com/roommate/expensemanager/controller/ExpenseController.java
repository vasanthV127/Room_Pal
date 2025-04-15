package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.DebtDto;
import com.roommate.expensemanager.dto.ExpenseDto;
import com.roommate.expensemanager.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@RequestBody ExpenseDto expenseDto) {
        return ResponseEntity.ok(expenseService.createExpense(expenseDto));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getExpenses(@RequestParam Long roomId) {
        return ResponseEntity.ok(expenseService.getExpensesByRoom(roomId));
    }

    @GetMapping("/personal")
    public ResponseEntity<List<ExpenseDto>> getPersonalExpenses(
            @RequestParam Long userId,
            @RequestParam Long roomId
    ) {
        return ResponseEntity.ok(expenseService.getPersonalExpenses(userId, roomId));
    }

    @GetMapping("/debts-to-pay")
    public ResponseEntity<List<DebtDto>> getDebtsToPay(
            @RequestParam Long userId,
            @RequestParam Long roomId
    ) {
        return ResponseEntity.ok(expenseService.getDebtsToPay(userId, roomId));
    }

    @GetMapping("/debts-owed")
    public ResponseEntity<List<DebtDto>> getDebtsOwed(
            @RequestParam Long userId,
            @RequestParam Long roomId
    ) {
        return ResponseEntity.ok(expenseService.getDebtsOwed(userId, roomId));
    }

    @GetMapping("/payer-suggestion")
    public ResponseEntity<Map<String, Object>> getPayerSuggestion(@RequestParam Long roomId) {
        return ResponseEntity.ok(expenseService.getPayerSuggestion(roomId));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<Map<String, Object>>> getExpenseSummary(
            @RequestParam Long roomId,
            @RequestParam Long userId,
            @RequestParam String period // day, month, year
    ) {
        return ResponseEntity.ok(expenseService.getExpenseSummary(roomId, userId, period));
    }
}