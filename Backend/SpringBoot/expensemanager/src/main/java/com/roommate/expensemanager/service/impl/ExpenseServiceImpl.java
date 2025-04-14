package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.ExpenseDto;
import com.roommate.expensemanager.model.Debt;
import com.roommate.expensemanager.model.Expense;
import com.roommate.expensemanager.model.Room;
import com.roommate.expensemanager.model.User;
import com.roommate.expensemanager.repository.DebtRepository;
import com.roommate.expensemanager.repository.ExpenseRepository;
import com.roommate.expensemanager.repository.RoomRepository;
import com.roommate.expensemanager.repository.UserRepository;
import com.roommate.expensemanager.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final DebtRepository debtRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, RoomRepository roomRepository,
                              UserRepository userRepository, DebtRepository debtRepository) {
        this.expenseRepository = expenseRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.debtRepository = debtRepository;
    }

    @Override
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        Room room = roomRepository.findById(expenseDto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        User payer = userRepository.findById(expenseDto.getPayerId())
                .orElseThrow(() -> new IllegalArgumentException("Payer not found"));

        // Verify split users are in room
        List<User> splitUsers = expenseDto.getSplitUserIds().stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("User " + id + " not found")))
                .filter(user -> room.getUsers().contains(user))
                .toList();

        if (splitUsers.isEmpty()) {
            throw new IllegalArgumentException("No valid users selected for split");
        }

        Expense expense = new Expense();
        expense.setProductName(expenseDto.getProductName());
        expense.setRate(expenseDto.getRate());
        expense.setQuantity(expenseDto.getQuantity());
        expense.setDate(expenseDto.getDate());
        expense.setRoom(room);
        expense.setPayer(payer);
        expense = expenseRepository.save(expense);

        // Split expense: total = rate * quantity
        double total = expenseDto.getRate() * expenseDto.getQuantity();
        double splitAmount = total / splitUsers.size(); // Split among selected users

        // Create debts for selected users (exclude payer if in split)
        for (User debtor : splitUsers) {
            if (!debtor.getId().equals(payer.getId())) {
                Debt debt = new Debt();
                debt.setDebtor(debtor);
                debt.setCreditor(payer);
                debt.setAmount(splitAmount);
                debt.setExpense(expense);
                debt.setStatus("pending");
                debtRepository.save(debt);
            }
        }

        ExpenseDto result = ExpenseDto.fromEntity(expense);
        result.setSplitUserIds(expenseDto.getSplitUserIds());
        return result;
    }

    @Override
    public List<ExpenseDto> getExpensesByRoom(Long roomId) {
        return expenseRepository.findByRoomId(roomId).stream()
                .map(expense -> {
                    ExpenseDto dto = ExpenseDto.fromEntity(expense);
                    // Optionally set splitUserIds if stored
                    return dto;
                })
                .toList();
    }
}