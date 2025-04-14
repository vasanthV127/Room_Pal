package com.roommate.expensemanager.dto;

import com.roommate.expensemanager.model.Debt;
import lombok.Data;

@Data
public class DebtDto {
    private Long id;
    private Long debtorId;
    private String debtorUsername;
    private Long creditorId;
    private String creditorUsername;
    private Double amount;
    private Long expenseId;
    private String productName;
    private String status;

    public static DebtDto fromEntity(Debt debt) {
        DebtDto dto = new DebtDto();
        dto.setId(debt.getId());
        dto.setDebtorId(debt.getDebtor().getId());
        dto.setDebtorUsername(debt.getDebtor().getUsername());
        dto.setCreditorId(debt.getCreditor().getId());
        dto.setCreditorUsername(debt.getCreditor().getUsername());
        dto.setAmount(debt.getAmount());
        dto.setExpenseId(debt.getExpense().getId());
        dto.setProductName(debt.getExpense().getProductName());
        dto.setStatus(debt.getStatus());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDebtorId() {
        return debtorId;
    }

    public void setDebtorId(Long debtorId) {
        this.debtorId = debtorId;
    }

    public String getDebtorUsername() {
        return debtorUsername;
    }

    public void setDebtorUsername(String debtorUsername) {
        this.debtorUsername = debtorUsername;
    }

    public Long getCreditorId() {
        return creditorId;
    }

    public void setCreditorId(Long creditorId) {
        this.creditorId = creditorId;
    }

    public String getCreditorUsername() {
        return creditorUsername;
    }

    public void setCreditorUsername(String creditorUsername) {
        this.creditorUsername = creditorUsername;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Long getExpenseId() {
        return expenseId;
    }

    public void setExpenseId(Long expenseId) {
        this.expenseId = expenseId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}