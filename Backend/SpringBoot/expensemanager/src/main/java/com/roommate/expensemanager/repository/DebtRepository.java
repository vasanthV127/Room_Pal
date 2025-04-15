package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DebtRepository extends JpaRepository<Debt, Long> {
    @Query("SELECT d FROM Debt d WHERE d.debtor.id = :debtorId AND d.expense.room.id = :roomId")
    List<Debt> findByDebtorIdAndRoomId(@Param("debtorId") Long debtorId, @Param("roomId") Long roomId);

    @Query("SELECT d FROM Debt d WHERE d.creditor.id = :creditorId AND d.expense.room.id = :roomId")
    List<Debt> findByCreditorIdAndRoomId(@Param("creditorId") Long creditorId, @Param("roomId") Long roomId);

    List<Debt> findByExpenseId(Long expenseId);
}