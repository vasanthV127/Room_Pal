package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.PollDto;
import com.roommate.expensemanager.dto.RecommendationDto;
import com.roommate.expensemanager.exception.RoomNotFoundException;
import com.roommate.expensemanager.exception.UserNotFoundException;
import com.roommate.expensemanager.model.PollOption;
import com.roommate.expensemanager.model.PurchasePoll;
import com.roommate.expensemanager.model.Room;
import com.roommate.expensemanager.model.User;
import com.roommate.expensemanager.repository.*;
import com.roommate.expensemanager.service.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class PollServiceImpl implements PollService {
    private final PurchasePollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public PollServiceImpl(PurchasePollRepository pollRepository, PollOptionRepository pollOptionRepository, UserRepository userRepository, RoomRepository roomRepository) {
        this.pollRepository = pollRepository;
        this.pollOptionRepository = pollOptionRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public PollDto createPoll(PollDto pollDto, String username) {
        PurchasePoll poll = new PurchasePoll();
        poll.setTitle(pollDto.getTitle());
        poll.setDescription(pollDto.getDescription());
        poll.setEndDate(pollDto.getEndDate());

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        Room room = roomRepository.findById(pollDto.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException("Room not found: " + pollDto.getRoomId()));

        if (!room.getMembers().contains(creator)) {
            throw new IllegalStateException("User is not a member of the room");
        }

        poll.setCreator(creator);
        poll.setRoom(room);
        poll = pollRepository.save(poll);
        return PollDto.fromEntity(poll);
    }

    @Override
    public PollDto addRecommendations(Long pollId, List<RecommendationDto> recommendations) {
        PurchasePoll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found: " + pollId));

        PurchasePoll finalPoll = poll;
        List<PollOption> options = recommendations.stream().map(dto -> {
            PollOption option = new PollOption();
            option.setName(dto.getProductName());
            option.setDescription(dto.getDescription() + " | URL: " + dto.getUrl());
            option.setPoll(finalPoll);
            return option;
        }).collect(Collectors.toList());

        poll.setOptions(options);
        poll = pollRepository.save(poll);
        pollOptionRepository.saveAll(options);

        return PollDto.fromEntity(poll);
    }
}