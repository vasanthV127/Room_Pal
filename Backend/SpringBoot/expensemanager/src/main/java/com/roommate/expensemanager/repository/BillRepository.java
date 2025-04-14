package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}