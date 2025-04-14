package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.DebtDto;
import com.roommate.expensemanager.dto.ExpenseDto;

import java.util.List;

public interface ExpenseService {
    ExpenseDto createExpense(ExpenseDto expenseDto);
    List<ExpenseDto> getExpensesByRoom(Long roomId);
    List<ExpenseDto> getPersonalExpenses(Long userId, Long roomId);
    List<DebtDto> getDebtsToPay(Long userId, Long roomId);
    List<DebtDto> getDebtsOwed(Long userId, Long roomId);
}