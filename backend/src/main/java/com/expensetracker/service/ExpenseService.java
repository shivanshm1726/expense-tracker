package com.expensetracker.service;

import com.expensetracker.dto.*;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    // Convert Expense entity → ExpenseResponse DTO
    private ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDate()
        );
    }

    // Get all expenses for a user (with optional filters)
    public List<ExpenseResponse> getExpenses(Long userId, String category, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses;

        if (category != null && !category.isEmpty()) {
            expenses = expenseRepository.findByUserIdAndCategoryOrderByDateDesc(userId, category);
        } else if (startDate != null && endDate != null) {
            expenses = expenseRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
        } else {
            expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        }

        return expenses.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Add a new expense
    public ExpenseResponse addExpense(Long userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setUser(user);

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    // Update an existing expense
    public ExpenseResponse updateExpense(Long userId, Long expenseId, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // Make sure this expense belongs to the user
        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());

        Expense updated = expenseRepository.save(expense);
        return toResponse(updated);
    }

    // Delete an expense
    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepository.delete(expense);
    }

    // Monthly summary (for bar chart)
    public List<MonthlySummary> getMonthlySummary(Long userId) {
        int currentYear = Year.now().getValue();
        List<Object[]> results = expenseRepository.getMonthlySummary(userId, currentYear);

        List<MonthlySummary> summaries = new ArrayList<>();
        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            Double total = (Double) row[1];
            summaries.add(new MonthlySummary(month, total));
        }
        return summaries;
    }

    // Category summary (for pie chart)
    public List<CategorySummary> getCategorySummary(Long userId) {
        List<Object[]> results = expenseRepository.getCategorySummary(userId);

        List<CategorySummary> summaries = new ArrayList<>();
        for (Object[] row : results) {
            String category = (String) row[0];
            Double total = (Double) row[1];
            summaries.add(new CategorySummary(category, total));
        }
        return summaries;
    }
}
