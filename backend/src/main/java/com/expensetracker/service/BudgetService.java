package com.expensetracker.service;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private BudgetResponse toResponse(Budget budget) {
        // Calculate spent amount for the budget's month/year
        LocalDate startOfMonth = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());
        
        // Sum expenses for this user in this month
        Double spent = expenseRepository.findByUserIdAndDateBetweenOrderByDateDesc(
                budget.getUser().getId(), startOfMonth, endOfMonth)
                .stream()
                .mapToDouble(e -> e.getAmount())
                .sum();

        Double remaining = budget.getMonthlyLimit() - spent;
        Double percentUsed = budget.getMonthlyLimit() > 0 ? (spent / budget.getMonthlyLimit()) * 100 : 0.0;
        
        String alertMessage = null;
        if (percentUsed >= 100) {
            alertMessage = "🚫 You exceeded your budget!";
        } else if (percentUsed >= 80) {
            alertMessage = "⚠️ You have used " + String.format("%.0f%%", percentUsed) + " of your budget.";
        }

        return new BudgetResponse(
                budget.getId(),
                budget.getMonthlyLimit(),
                budget.getMonth(),
                budget.getYear(),
                spent,
                remaining,
                percentUsed,
                alertMessage
        );
    }

    public List<BudgetResponse> getBudgets(Long userId) {
        return budgetRepository.findByUserIdOrderByYearDescMonthDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BudgetResponse getBudgetForMonth(Long userId, Integer month, Integer year) {
        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        return budgetOpt.map(this::toResponse).orElse(null);
    }

    public BudgetResponse setBudget(Long userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if budget already exists for this month/year
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, request.getMonth(), request.getYear())
                .orElse(new Budget());

        budget.setUser(user);
        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        Budget saved = budgetRepository.save(budget);
        return toResponse(saved);
    }

    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        budgetRepository.delete(budget);
    }
}
