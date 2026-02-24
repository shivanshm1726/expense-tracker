package com.expensetracker.controller;

import com.expensetracker.dto.IncomeRequest;
import com.expensetracker.dto.IncomeResponse;
import com.expensetracker.dto.MonthlySummary;
import com.expensetracker.dto.SourceSummary;
import com.expensetracker.service.IncomeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getIncomes(
            @RequestParam Long userId,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(incomeService.getIncomes(userId, source, startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<IncomeResponse> addIncome(
            @RequestParam Long userId,
            @RequestBody IncomeRequest request) {
        
        return ResponseEntity.ok(incomeService.addIncome(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(
            @RequestParam Long userId,
            @PathVariable Long id,
            @RequestBody IncomeRequest request) {
        
        return ResponseEntity.ok(incomeService.updateIncome(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(
            @RequestParam Long userId,
            @PathVariable Long id) {
        
        incomeService.deleteIncome(userId, id);
        return ResponseEntity.ok("Income deleted successfully!");
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<List<MonthlySummary>> getMonthlySummary(@RequestParam Long userId) {
        return ResponseEntity.ok(incomeService.getMonthlySummary(userId));
    }

    @GetMapping("/source-summary")
    public ResponseEntity<List<SourceSummary>> getSourceSummary(@RequestParam Long userId) {
        return ResponseEntity.ok(incomeService.getSourceSummary(userId));
    }
}
