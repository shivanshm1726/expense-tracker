package com.expensetracker.controller;

import com.expensetracker.dto.*;
import com.expensetracker.service.ExpenseService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // GET /api/expenses?userId=1&category=Food&startDate=2026-01-01&endDate=2026-01-31
    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(
            @RequestParam Long userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ExpenseResponse> expenses = expenseService.getExpenses(userId, category, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }

    // POST /api/expenses?userId=1
    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(
            @RequestParam Long userId,
            @RequestBody ExpenseRequest request) {

        ExpenseResponse expense = expenseService.addExpense(userId, request);
        return ResponseEntity.ok(expense);
    }

    // PUT /api/expenses/5?userId=1
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @RequestParam Long userId,
            @PathVariable Long id,
            @RequestBody ExpenseRequest request) {

        ExpenseResponse expense = expenseService.updateExpense(userId, id, request);
        return ResponseEntity.ok(expense);
    }

    // DELETE /api/expenses/5?userId=1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(
            @RequestParam Long userId,
            @PathVariable Long id) {

        expenseService.deleteExpense(userId, id);
        return ResponseEntity.ok("Expense deleted successfully!");
    }

    // GET /api/expenses/monthly-summary?userId=1
    @GetMapping("/monthly-summary")
    public ResponseEntity<List<MonthlySummary>> getMonthlySummary(@RequestParam Long userId) {
        return ResponseEntity.ok(expenseService.getMonthlySummary(userId));
    }

    // GET /api/expenses/category-summary?userId=1
    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummary>> getCategorySummary(@RequestParam Long userId) {
        return ResponseEntity.ok(expenseService.getCategorySummary(userId));
    }
}
