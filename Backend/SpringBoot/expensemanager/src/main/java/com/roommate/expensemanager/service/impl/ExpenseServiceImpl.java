package com.roommate.expensemanager.service.impl;

import com.roommate.expensemanager.dto.DebtDto;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final DebtRepository debtRepository;

    public ExpenseServiceImpl(
            ExpenseRepository expenseRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            DebtRepository debtRepository
    ) {
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

        double total = expenseDto.getRate() * expenseDto.getQuantity();
        double splitAmount = total / splitUsers.size();

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
                    return dto;
                })
                .toList();
    }

    @Override
    public List<ExpenseDto> getPersonalExpenses(Long userId, Long roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return expenseRepository.findByPayerIdAndRoomId(userId, roomId).stream()
                .map(expense -> {
                    ExpenseDto dto = ExpenseDto.fromEntity(expense);
                    return dto;
                })
                .filter(dto -> {
                    List<Debt> debts = debtRepository.findByExpenseId(dto.getId());
                    return debts.isEmpty();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<DebtDto> getDebtsToPay(Long userId, Long roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return debtRepository.findByDebtorIdAndRoomId(userId, roomId).stream()
                .map(DebtDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<DebtDto> getDebtsOwed(Long userId, Long roomId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return debtRepository.findByCreditorIdAndRoomId(userId, roomId).stream()
                .map(DebtDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getPayerSuggestion(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        List<User> users = room.getUsers();
        Map<Long, Long> paymentCounts = users.stream()
                .collect(Collectors.toMap(
                        User::getId,
                        user -> (long) expenseRepository.findByPayerIdAndRoomId(user.getId(), roomId).size()
                ));
        Long suggestedUserId = paymentCounts.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(users.get(0).getId());
        User suggestedUser = userRepository.findById(suggestedUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Map<String, Object> response = new HashMap<>();
        response.put("userId", suggestedUserId);
        response.put("username", suggestedUser.getUsername());
        return response;
    }
}