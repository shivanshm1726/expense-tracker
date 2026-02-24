package com.expensetracker.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RecurringExpenseResponse {
    private Long id;
    private String title;
    private Double amount;
    private String category;
    private String frequency;
    private LocalDate nextDueDate;
    private Boolean active;
}
