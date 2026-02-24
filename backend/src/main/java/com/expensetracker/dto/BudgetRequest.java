package com.expensetracker.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BudgetRequest {
    private Double monthlyLimit;
    private Integer month;
    private Integer year;
}
