package com.expensetracker.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class IncomeResponse {
    private Long id;
    private String title;
    private Double amount;
    private String source;
    private LocalDate date;
}
