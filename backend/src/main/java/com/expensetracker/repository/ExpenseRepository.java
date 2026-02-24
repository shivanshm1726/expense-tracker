package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Get all expenses for a user
    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    // Filter by category
    List<Expense> findByUserIdAndCategoryOrderByDateDesc(Long userId, String category);

    // Filter by date range
    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate start, LocalDate end);

    // Monthly summary: total per month for a given year
    @Query("SELECT CAST(EXTRACT(MONTH FROM e.date) AS INTEGER) as month, SUM(e.amount) as total " +
           "FROM Expense e WHERE e.user.id = :userId AND CAST(EXTRACT(YEAR FROM e.date) AS INTEGER) = :year " +
           "GROUP BY EXTRACT(MONTH FROM e.date) ORDER BY EXTRACT(MONTH FROM e.date)")
    List<Object[]> getMonthlySummary(@Param("userId") Long userId, @Param("year") int year);

    // Category summary: total per category
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e " +
           "WHERE e.user.id = :userId GROUP BY e.category")
    List<Object[]> getCategorySummary(@Param("userId") Long userId);

    // Total expenses for a user in a given month/year
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.user.id = :userId AND CAST(EXTRACT(MONTH FROM e.date) AS INTEGER) = :month " +
           "AND CAST(EXTRACT(YEAR FROM e.date) AS INTEGER) = :year")
    Double getTotalByMonth(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
}
