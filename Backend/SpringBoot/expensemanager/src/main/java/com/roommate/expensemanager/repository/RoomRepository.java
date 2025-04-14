package com.roommate.expensemanager.repository;

import com.roommate.expensemanager.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByInviteCode(String inviteCode);
    boolean existsByInviteCode(String inviteCode);
}