package com.roommate.expensemanager.dto;

import com.roommate.expensemanager.model.Expense;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ExpenseDto {
    private Long id;
    private String productName;
    private Double rate;
    private Integer quantity;
    private LocalDate date;
    private Long roomId;
    private Long payerId;
    private List<Long> splitUserIds; // Users to split debt with

    public static ExpenseDto fromEntity(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setProductName(expense.getProductName());
        dto.setRate(expense.getRate());
        dto.setQuantity(expense.getQuantity());
        dto.setDate(expense.getDate());
        dto.setRoomId(expense.getRoom().getId());
        dto.setPayerId(expense.getPayer().getId());
        // splitUserIds set separately if needed
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getPayerId() {
        return payerId;
    }

    public void setPayerId(Long payerId) {
        this.payerId = payerId;
    }

    public List<Long> getSplitUserIds() {
        return splitUserIds;
    }

    public void setSplitUserIds(List<Long> splitUserIds) {
        this.splitUserIds = splitUserIds;
    }
}