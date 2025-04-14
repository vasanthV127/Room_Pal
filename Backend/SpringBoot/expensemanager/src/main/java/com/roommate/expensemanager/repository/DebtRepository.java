package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.Debt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DebtRepository extends JpaRepository<Debt, Long> {
    List<Debt> findByDebtorIdOrCreditorId(Long debtorId, Long creditorId);
}