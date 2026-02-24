package com.expensetracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "budgets", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "month", "year"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double monthlyLimit;

    @Column(nullable = false)
    private Integer month; // 1-12

    @Column(name = "budget_year", nullable = false)
    private Integer year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
