package com.roommate.expensemanager.controller;

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
}