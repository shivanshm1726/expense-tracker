package com.expensetracker.scheduler;

import com.expensetracker.service.RecurringExpenseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RecurringExpenseScheduler {

    private static final Logger logger = LoggerFactory.getLogger(RecurringExpenseScheduler.class);

    private final RecurringExpenseService recurringExpenseService;

    public RecurringExpenseScheduler(RecurringExpenseService recurringExpenseService) {
        this.recurringExpenseService = recurringExpenseService;
    }

    @Scheduled(cron = "0 5 0 * * *")
    public void processDueRecurringExpenses() {
        int createdExpenses = recurringExpenseService.processDueRecurringExpenses();
        if (createdExpenses > 0) {
            logger.info("Recurring scheduler created {} expense(s)", createdExpenses);
        }
    }
}
