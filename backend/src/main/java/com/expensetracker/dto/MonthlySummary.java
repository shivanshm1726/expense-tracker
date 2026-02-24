package com.expensetracker.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MonthlySummary {
    private Integer month;
    private Double total;
}
