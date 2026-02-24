package com.expensetracker.repository;

import com.expensetracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserIdOrderByDateDesc(Long userId);

    List<Income> findByUserIdAndSourceOrderByDateDesc(Long userId, String source);

    List<Income> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate start, LocalDate end);

    // Monthly summary for income
    @Query("SELECT CAST(EXTRACT(MONTH FROM i.date) AS INTEGER) as month, SUM(i.amount) as total " +
           "FROM Income i WHERE i.user.id = :userId AND CAST(EXTRACT(YEAR FROM i.date) AS INTEGER) = :year " +
           "GROUP BY EXTRACT(MONTH FROM i.date) ORDER BY EXTRACT(MONTH FROM i.date)")
    List<Object[]> getMonthlySummary(@Param("userId") Long userId, @Param("year") int year);

    // Source summary
    @Query("SELECT i.source, SUM(i.amount) FROM Income i " +
           "WHERE i.user.id = :userId GROUP BY i.source")
    List<Object[]> getSourceSummary(@Param("userId") Long userId);

    // Total income for a user in a given month/year
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i " +
           "WHERE i.user.id = :userId AND CAST(EXTRACT(MONTH FROM i.date) AS INTEGER) = :month " +
           "AND CAST(EXTRACT(YEAR FROM i.date) AS INTEGER) = :year")
    Double getTotalByMonth(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
}
