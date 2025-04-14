package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.RoomDto;
import com.roommate.expensemanager.exception.RoomNotFoundException;
import com.roommate.expensemanager.exception.UserNotFoundException;
import com.roommate.expensemanager.model.Room;
import com.roommate.expensemanager.model.User;
import com.roommate.expensemanager.repository.RoomRepository;
import com.roommate.expensemanager.repository.UserRepository;
import com.roommate.expensemanager.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service

public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int INVITE_CODE_LENGTH = 8;

    public RoomServiceImpl(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Override
    public RoomDto createRoom(RoomDto roomDto) {
        Room room = new Room();
        room.setName(roomDto.getName());
        room.setDescription(roomDto.getDescription());
        room.setInviteCode(generateUniqueInviteCode());
        room.setIsActive(true);

        room = roomRepository.save(room);
        return RoomDto.fromEntity(room);
    }

    @Override
    public RoomDto joinRoom(String inviteCode, String username) {
        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RoomNotFoundException("Invalid invite code: " + inviteCode));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        if (!room.getMembers().contains(user)) {
            room.getMembers().add(user);
            user.getRooms().add(room);
            roomRepository.save(room);
            userRepository.save(user);
        }

        return RoomDto.fromEntity(room);
    }

    @Override
    public RoomDto addUserToRoom(Long roomId, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        if (!room.getMembers().contains(user)) {
            room.getMembers().add(user);
            user.getRooms().add(room);
            roomRepository.save(room);
            userRepository.save(user);
        }

        return RoomDto.fromEntity(room);
    }

    @Override
    public List<Long> getRoomMembers(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));
        return room.getMembers().stream()
                .map(User::getId)
                .toList();
    }

    private String generateUniqueInviteCode() {
        SecureRandom random = new SecureRandom();
        String code;
        do {
            StringBuilder sb = new StringBuilder(INVITE_CODE_LENGTH);
            for (int i = 0; i < INVITE_CODE_LENGTH; i++) {
                sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
            }
            code = sb.toString();
        } while (roomRepository.existsByInviteCode(code));
        return code;
    }
}