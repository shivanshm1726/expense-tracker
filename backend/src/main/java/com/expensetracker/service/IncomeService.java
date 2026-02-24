package com.expensetracker.service;

import com.expensetracker.dto.IncomeRequest;
import com.expensetracker.dto.IncomeResponse;
import com.expensetracker.dto.MonthlySummary;
import com.expensetracker.dto.SourceSummary;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeService(IncomeRepository incomeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    private IncomeResponse toResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getTitle(),
                income.getAmount(),
                income.getSource(),
                income.getDate()
        );
    }

    public List<IncomeResponse> getIncomes(Long userId, String source, LocalDate startDate, LocalDate endDate) {
        List<Income> incomes;

        if (source != null && !source.isEmpty()) {
            incomes = incomeRepository.findByUserIdAndSourceOrderByDateDesc(userId, source);
        } else if (startDate != null && endDate != null) {
            incomes = incomeRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
        } else {
            incomes = incomeRepository.findByUserIdOrderByDateDesc(userId);
        }

        return incomes.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public IncomeResponse addIncome(Long userId, IncomeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Income income = new Income();
        income.setTitle(request.getTitle());
        income.setAmount(request.getAmount());
        income.setSource(request.getSource());
        income.setDate(request.getDate());
        income.setUser(user);

        Income saved = incomeRepository.save(income);
        return toResponse(saved);
    }

    public IncomeResponse updateIncome(Long userId, Long incomeId, IncomeRequest request) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        income.setTitle(request.getTitle());
        income.setAmount(request.getAmount());
        income.setSource(request.getSource());
        income.setDate(request.getDate());

        Income updated = incomeRepository.save(income);
        return toResponse(updated);
    }

    public void deleteIncome(Long userId, Long incomeId) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        incomeRepository.delete(income);
    }

    public List<MonthlySummary> getMonthlySummary(Long userId) {
        int currentYear = Year.now().getValue();
        List<Object[]> results = incomeRepository.getMonthlySummary(userId, currentYear);

        List<MonthlySummary> summaries = new ArrayList<>();
        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            Double total = (Double) row[1];
            summaries.add(new MonthlySummary(month, total));
        }
        return summaries;
    }

    public List<SourceSummary> getSourceSummary(Long userId) {
        List<Object[]> results = incomeRepository.getSourceSummary(userId);

        List<SourceSummary> summaries = new ArrayList<>();
        for (Object[] row : results) {
            String source = (String) row[0];
            Double total = (Double) row[1];
            summaries.add(new SourceSummary(source, total));
        }
        return summaries;
    }
}
