package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Long> {
    Optional<ItemCategory> findByName(String name);
}