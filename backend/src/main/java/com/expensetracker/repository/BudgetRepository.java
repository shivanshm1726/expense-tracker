package com.expensetracker.repository;

import com.expensetracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);
    List<Budget> findByUserIdOrderByYearDescMonthDesc(Long userId);
}
