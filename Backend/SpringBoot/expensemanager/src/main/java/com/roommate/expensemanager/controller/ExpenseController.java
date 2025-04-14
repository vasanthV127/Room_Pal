package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.DebtDto;
import com.roommate.expensemanager.dto.ExpenseDto;
import com.roommate.expensemanager.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // API 1: Personal expenses (self-buy)
    @GetMapping("/personal")
    public ResponseEntity<List<ExpenseDto>> getPersonalExpenses(
            @RequestParam Long userId,
            @RequestParam Long roomId
    ) {
        return ResponseEntity.ok(expenseService.getPersonalExpenses(userId, roomId));
    }

    // API 2: Debts user needs to pay
    @GetMapping("/debts-to-pay")
    public ResponseEntity<List<DebtDto>> getDebtsToPay(
            @RequestParam Long userId,
            @RequestParam Long roomId
    ) {
        return ResponseEntity.ok(expenseService.getDebtsToPay(userId, roomId));
    }

    // API 3: Debts owed to user
    @GetMapping("/debts-owed")
    public ResponseEntity<List<DebtDto>> getDebtsOwed(
            @RequestParam Long userId,
            @RequestParam Long roomId
    ) {
        return ResponseEntity.ok(expenseService.getDebtsOwed(userId, roomId));
    }
}