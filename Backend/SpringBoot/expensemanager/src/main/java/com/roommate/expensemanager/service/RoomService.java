package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.RoomDto;

import java.util.List;

public interface RoomService {
    RoomDto createRoom(RoomDto roomDto);
    RoomDto joinRoom(String inviteCode, String username);
    RoomDto addUserToRoom(Long roomId, String username);
    List<Long> getRoomMembers(Long roomId);
}