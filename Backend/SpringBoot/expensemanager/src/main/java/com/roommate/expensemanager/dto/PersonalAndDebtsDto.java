package com.roommate.expensemanager.dto;

import java.util.List;

public class PersonalAndDebtsDto {
    private List<ExpenseDto> personalExpenses;
    private List<DebtDto> debtsOwedToUser;
    private List<DebtDto> debtsUserOwes;

    public PersonalAndDebtsDto() {}

    public PersonalAndDebtsDto(
            List<ExpenseDto> personalExpenses,
            List<DebtDto> debtsOwedToUser,
            List<DebtDto> debtsUserOwes
    ) {
        this.personalExpenses = personalExpenses;
        this.debtsOwedToUser = debtsOwedToUser;
        this.debtsUserOwes = debtsUserOwes;
    }

    public List<ExpenseDto> getPersonalExpenses() {
        return personalExpenses;
    }

    public void setPersonalExpenses(List<ExpenseDto> personalExpenses) {
        this.personalExpenses = personalExpenses;
    }

    public List<DebtDto> getDebtsOwedToUser() {
        return debtsOwedToUser;
    }

    public void setDebtsOwedToUser(List<DebtDto> debtsOwedToUser) {
        this.debtsOwedToUser = debtsOwedToUser;
    }

    public List<DebtDto> getDebtsUserOwes() {
        return debtsUserOwes;
    }

    public void setDebtsUserOwes(List<DebtDto> debtsUserOwes) {
        this.debtsUserOwes = debtsUserOwes;
    }
}