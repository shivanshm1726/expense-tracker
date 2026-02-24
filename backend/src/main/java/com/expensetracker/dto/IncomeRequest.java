package com.expensetracker.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class IncomeRequest {
    private String title;
    private Double amount;
    private String source;
    private LocalDate date;
}
