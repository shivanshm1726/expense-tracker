package com.expensetracker.controller;

import com.expensetracker.dto.RecurringExpenseRequest;
import com.expensetracker.dto.RecurringExpenseResponse;
import com.expensetracker.service.RecurringExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recurring")
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;

    public RecurringExpenseController(RecurringExpenseService recurringExpenseService) {
        this.recurringExpenseService = recurringExpenseService;
    }

    @GetMapping
    public ResponseEntity<List<RecurringExpenseResponse>> getRecurringExpenses(@RequestParam Long userId) {
        return ResponseEntity.ok(recurringExpenseService.getRecurringExpenses(userId));
    }

    @PostMapping
    public ResponseEntity<RecurringExpenseResponse> addRecurringExpense(
            @RequestParam Long userId,
            @RequestBody RecurringExpenseRequest request) {

        return ResponseEntity.ok(recurringExpenseService.addRecurringExpense(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringExpenseResponse> updateRecurringExpense(
            @RequestParam Long userId,
            @PathVariable Long id,
            @RequestBody RecurringExpenseRequest request) {

        return ResponseEntity.ok(recurringExpenseService.updateRecurringExpense(userId, id, request));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<RecurringExpenseResponse> toggleActiveStatus(
            @RequestParam Long userId,
            @PathVariable Long id,
            @RequestParam boolean active) {

        return ResponseEntity.ok(recurringExpenseService.toggleActiveStatus(userId, id, active));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecurringExpense(
            @RequestParam Long userId,
            @PathVariable Long id) {

        recurringExpenseService.deleteRecurringExpense(userId, id);
        return ResponseEntity.ok("Recurring expense deleted successfully!");
    }

    @PostMapping("/process-due")
    public ResponseEntity<Map<String, Object>> processDueRecurringExpenses() {
        int createdExpenses = recurringExpenseService.processDueRecurringExpenses();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Due recurring expenses processed successfully");
        response.put("createdExpenses", createdExpenses);
        return ResponseEntity.ok(response);
    }
}
