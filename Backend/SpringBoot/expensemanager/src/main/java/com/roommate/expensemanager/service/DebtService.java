package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.DebtDto;

import java.util.List;

public interface DebtService {
    void payDebt(Long debtId);
    List<DebtDto> getDebts(Long userId);
}