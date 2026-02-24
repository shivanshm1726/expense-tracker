package com.expensetracker.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SourceSummary {
    private String source;
    private Double total;
}
