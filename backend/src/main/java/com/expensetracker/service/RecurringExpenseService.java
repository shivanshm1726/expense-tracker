package com.expensetracker.service;

import com.expensetracker.dto.RecurringExpenseRequest;
import com.expensetracker.dto.RecurringExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.RecurringExpense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.RecurringExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecurringExpenseService {

    private final RecurringExpenseRepository recurringExpenseRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public RecurringExpenseService(
            RecurringExpenseRepository recurringExpenseRepository,
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {
        this.recurringExpenseRepository = recurringExpenseRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private RecurringExpenseResponse toResponse(RecurringExpense expense) {
        return new RecurringExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getFrequency(),
                expense.getNextDueDate(),
                expense.getActive()
        );
    }

    public List<RecurringExpenseResponse> getRecurringExpenses(Long userId) {
        return recurringExpenseRepository.findByUserIdOrderByNextDueDateAsc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RecurringExpenseResponse addRecurringExpense(Long userId, RecurringExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RecurringExpense expense = new RecurringExpense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setFrequency(request.getFrequency());
        expense.setNextDueDate(request.getNextDueDate());
        expense.setActive(true);
        expense.setUser(user);

        RecurringExpense saved = recurringExpenseRepository.save(expense);
        return toResponse(saved);
    }

    public RecurringExpenseResponse updateRecurringExpense(Long userId, Long id, RecurringExpenseRequest request) {
        RecurringExpense expense = recurringExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setFrequency(request.getFrequency());
        expense.setNextDueDate(request.getNextDueDate());

        RecurringExpense updated = recurringExpenseRepository.save(expense);
        return toResponse(updated);
    }

    public RecurringExpenseResponse toggleActiveStatus(Long userId, Long id, boolean active) {
        RecurringExpense expense = recurringExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        expense.setActive(active);
        RecurringExpense updated = recurringExpenseRepository.save(expense);
        return toResponse(updated);
    }

    public void deleteRecurringExpense(Long userId, Long id) {
        RecurringExpense expense = recurringExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        recurringExpenseRepository.delete(expense);
    }

    @Transactional
    public int processDueRecurringExpenses() {
        LocalDate today = LocalDate.now();
        List<RecurringExpense> dueRecurring = recurringExpenseRepository.findByActiveTrueAndNextDueDateLessThanEqual(today);

        int createdExpenses = 0;

        for (RecurringExpense recurring : dueRecurring) {
            LocalDate dueDate = recurring.getNextDueDate();

            while (dueDate != null && !dueDate.isAfter(today)) {
                Expense generated = new Expense();
                generated.setTitle(recurring.getTitle());
                generated.setAmount(recurring.getAmount());
                generated.setCategory(recurring.getCategory());
                generated.setDate(dueDate);
                generated.setUser(recurring.getUser());
                expenseRepository.save(generated);

                createdExpenses++;
                dueDate = incrementDueDate(dueDate, recurring.getFrequency());
            }

            recurring.setNextDueDate(dueDate);
            recurringExpenseRepository.save(recurring);
        }

        return createdExpenses;
    }

    private LocalDate incrementDueDate(LocalDate currentDate, String frequency) {
        if ("WEEKLY".equalsIgnoreCase(frequency)) {
            return currentDate.plusWeeks(1);
        }

        return currentDate.plusMonths(1);
    }
}
