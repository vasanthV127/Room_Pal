package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillItemRepository extends JpaRepository<BillItem, Long> {
}