package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.ExpenseDto;

import java.util.List;

public interface ExpenseService {
    ExpenseDto createExpense(ExpenseDto expenseDto);
    List<ExpenseDto> getExpensesByRoom(Long roomId);
}