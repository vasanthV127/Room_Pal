package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByRoomId(Long roomId);
}