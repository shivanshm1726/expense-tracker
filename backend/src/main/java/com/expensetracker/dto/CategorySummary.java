package com.expensetracker.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CategorySummary {
    private String category;
    private Double total;
}
