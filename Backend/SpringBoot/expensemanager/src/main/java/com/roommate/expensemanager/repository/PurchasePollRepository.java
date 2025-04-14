package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.PurchasePoll;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchasePollRepository extends JpaRepository<PurchasePoll, Long> {
}