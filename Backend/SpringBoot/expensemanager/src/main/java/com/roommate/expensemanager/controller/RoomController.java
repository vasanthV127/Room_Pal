package com.roommate.expensemanager.controller;

import com.roommate.expensemanager.dto.RoomDto;
import com.roommate.expensemanager.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")

public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }
    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@RequestBody RoomDto roomDto) {
        return ResponseEntity.ok(roomService.createRoom(roomDto));
    }

    @PostMapping("/join/{inviteCode}")
    public ResponseEntity<RoomDto> joinRoom(
            @PathVariable String inviteCode,
            @RequestParam String username) {
        return ResponseEntity.ok(roomService.joinRoom(inviteCode, username));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<RoomDto> addUserToRoom(
            @PathVariable Long id,
            @RequestParam String username) {
        return ResponseEntity.ok(roomService.addUserToRoom(id, username));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<Long>> getRoomMembers(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomMembers(id));
    }
}