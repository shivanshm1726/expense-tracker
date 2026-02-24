package com.expensetracker.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private Double monthlyLimit;
    private Integer month;
    private Integer year;
    private Double spent;
    private Double remaining;
    private Double percentUsed;
    private String alertMessage;
}
