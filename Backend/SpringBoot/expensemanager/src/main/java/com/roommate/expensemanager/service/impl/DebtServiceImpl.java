package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.DebtDto;
import com.roommate.expensemanager.model.Debt;
import com.roommate.expensemanager.repository.DebtRepository;
import com.roommate.expensemanager.service.DebtService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DebtServiceImpl implements DebtService {
    private final DebtRepository debtRepository;

    public DebtServiceImpl(DebtRepository debtRepository) {
        this.debtRepository = debtRepository;
    }

    @Override
    public void payDebt(Long debtId) {
        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new IllegalArgumentException("Debt not found"));
        debt.setStatus("paid");
        debtRepository.save(debt);
    }

    @Override
    public List<DebtDto> getDebts(Long userId) {
        return debtRepository.findByDebtorIdAndRoomId(userId, userId).stream()
                .map(DebtDto::fromEntity)
                .toList();
    }
}