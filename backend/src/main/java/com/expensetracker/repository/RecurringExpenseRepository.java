package com.expensetracker.repository;

import com.expensetracker.entity.RecurringExpense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RecurringExpenseRepository extends JpaRepository<RecurringExpense, Long> {
    List<RecurringExpense> findByUserIdOrderByNextDueDateAsc(Long userId);
    List<RecurringExpense> findByActiveTrueAndNextDueDateLessThanEqual(LocalDate date);
}
