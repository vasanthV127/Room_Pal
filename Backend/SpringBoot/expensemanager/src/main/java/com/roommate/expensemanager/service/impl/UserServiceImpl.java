package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.UserDto;
import com.roommate.expensemanager.model.User;
import com.roommate.expensemanager.repository.UserRepository;
import com.roommate.expensemanager.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword()); // Plain text
        user.setFullName(userDto.getFullName());
        user.setProfilePicture(userDto.getProfilePicture());
        user.setCreatedAt(userDto.getCreatedAt());
        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    @Override
    public UserDto findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserDto::fromEntity)
                .orElse(null);
    }
}