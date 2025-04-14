package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PollOptionRepository extends JpaRepository<PollOption, Long> {
}