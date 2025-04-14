package com.roommate.expensemanager.service;

import com.roommate.expensemanager.dto.UserDto;

public interface UserService {
    UserDto createUser(UserDto userDto);
}