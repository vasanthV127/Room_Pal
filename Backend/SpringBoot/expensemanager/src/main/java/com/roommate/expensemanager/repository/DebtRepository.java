package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DebtRepository extends JpaRepository<Debt, Long> {
    @Query("SELECT d FROM Debt d JOIN d.expense e WHERE d.creditor.id = :creditorId AND e.room.id = :roomId")
    List<Debt> findByCreditorIdAndRoomId(Long creditorId, Long roomId);

    @Query("SELECT d FROM Debt d JOIN d.expense e WHERE d.debtor.id = :debtorId AND e.room.id = :roomId")
    List<Debt> findByDebtorIdAndRoomId(Long debtorId, Long roomId);

    List<Debt> findByExpenseId(Long expenseId);
}