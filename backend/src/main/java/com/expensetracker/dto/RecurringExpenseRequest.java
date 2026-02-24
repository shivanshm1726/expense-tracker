package com.expensetracker.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RecurringExpenseRequest {
    private String title;
    private Double amount;
    private String category;
    private String frequency; // MONTHLY, WEEKLY
    private LocalDate nextDueDate;
}
