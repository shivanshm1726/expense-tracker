package com.expensetracker.controller;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(@RequestParam Long userId) {
        return ResponseEntity.ok(budgetService.getBudgets(userId));
    }

    @GetMapping("/current")
    public ResponseEntity<BudgetResponse> getCurrentBudget(
            @RequestParam Long userId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        LocalDate now = LocalDate.now();
        int targetMonth = month != null ? month : now.getMonthValue();
        int targetYear = year != null ? year : now.getYear();

        return ResponseEntity.ok(budgetService.getBudgetForMonth(userId, targetMonth, targetYear));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> setBudget(
            @RequestParam Long userId,
            @RequestBody BudgetRequest request) {

        return ResponseEntity.ok(budgetService.setBudget(userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(
            @RequestParam Long userId,
            @PathVariable Long id) {

        budgetService.deleteBudget(userId, id);
        return ResponseEntity.ok("Budget deleted successfully!");
    }
}
