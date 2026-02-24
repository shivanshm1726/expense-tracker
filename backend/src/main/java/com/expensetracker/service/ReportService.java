package com.expensetracker.service;

import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReportService {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public ReportService(
            UserRepository userRepository,
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    public byte[] generateExcelReport(Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Income> incomes = incomeRepository.findByUserIdOrderByDateDesc(userId);
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            CellStyle headerStyle = createHeaderStyle(workbook);

            buildIncomeSheet(workbook, headerStyle, incomes);
            buildExpenseSheet(workbook, headerStyle, expenses);
            buildSummarySheet(workbook, headerStyle, user, userId, incomes, expenses);

            workbook.write(output);
            return output.toByteArray();
        }
    }

    private CellStyle createHeaderStyle(XSSFWorkbook workbook) {
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);
        return headerStyle;
    }

    private void buildIncomeSheet(XSSFWorkbook workbook, CellStyle headerStyle, List<Income> incomes) {
        XSSFSheet sheet = workbook.createSheet("Income");

        Row headerRow = sheet.createRow(0);
        setHeaderCell(headerRow, 0, "Date", headerStyle);
        setHeaderCell(headerRow, 1, "Title", headerStyle);
        setHeaderCell(headerRow, 2, "Source", headerStyle);
        setHeaderCell(headerRow, 3, "Amount", headerStyle);

        int rowIndex = 1;
        for (Income income : incomes) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(income.getDate().toString());
            row.createCell(1).setCellValue(income.getTitle());
            row.createCell(2).setCellValue(income.getSource());
            row.createCell(3).setCellValue(income.getAmount());
        }

        autoSizeColumns(sheet, 4);
    }

    private void buildExpenseSheet(XSSFWorkbook workbook, CellStyle headerStyle, List<Expense> expenses) {
        XSSFSheet sheet = workbook.createSheet("Expense");

        Row headerRow = sheet.createRow(0);
        setHeaderCell(headerRow, 0, "Date", headerStyle);
        setHeaderCell(headerRow, 1, "Title", headerStyle);
        setHeaderCell(headerRow, 2, "Category", headerStyle);
        setHeaderCell(headerRow, 3, "Amount", headerStyle);

        int rowIndex = 1;
        for (Expense expense : expenses) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(expense.getDate().toString());
            row.createCell(1).setCellValue(expense.getTitle());
            row.createCell(2).setCellValue(expense.getCategory());
            row.createCell(3).setCellValue(expense.getAmount());
        }

        autoSizeColumns(sheet, 4);
    }

    private void buildSummarySheet(
            XSSFWorkbook workbook,
            CellStyle headerStyle,
            User user,
            Long userId,
            List<Income> incomes,
            List<Expense> expenses) {

        XSSFSheet sheet = workbook.createSheet("Summary");

        double totalIncome = incomes.stream().mapToDouble(Income::getAmount).sum();
        double totalExpense = expenses.stream().mapToDouble(Expense::getAmount).sum();
        double netBalance = totalIncome - totalExpense;

        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        Double monthlyIncome = incomeRepository.getTotalByMonth(userId, month, year);
        Double monthlyExpense = expenseRepository.getTotalByMonth(userId, month, year);

        Budget currentBudget = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year).orElse(null);
        Double budgetLimit = currentBudget != null ? currentBudget.getMonthlyLimit() : 0.0;
        Double budgetRemaining = budgetLimit - monthlyExpense;

        Row titleRow = sheet.createRow(0);
        setHeaderCell(titleRow, 0, "Money Manager Report", headerStyle);

        createKeyValueRow(sheet, 2, "User", user.getName());
        createKeyValueRow(sheet, 3, "Email", user.getEmail());
        createKeyValueRow(sheet, 4, "Report Date", now.toString());

        createKeyValueRow(sheet, 6, "Total Income", totalIncome);
        createKeyValueRow(sheet, 7, "Total Expense", totalExpense);
        createKeyValueRow(sheet, 8, "Net Balance", netBalance);

        createKeyValueRow(sheet, 10, "Monthly Income (Current Month)", monthlyIncome);
        createKeyValueRow(sheet, 11, "Monthly Expense (Current Month)", monthlyExpense);
        createKeyValueRow(sheet, 12, "Budget Limit (Current Month)", budgetLimit);
        createKeyValueRow(sheet, 13, "Budget Remaining (Current Month)", budgetRemaining);

        autoSizeColumns(sheet, 2);
    }

    private void setHeaderCell(Row row, int cellIndex, String value, CellStyle style) {
        Cell cell = row.createCell(cellIndex);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private void createKeyValueRow(XSSFSheet sheet, int rowIndex, String key, Object value) {
        Row row = sheet.createRow(rowIndex);
        row.createCell(0).setCellValue(key);
        row.createCell(1).setCellValue(value == null ? "-" : String.valueOf(value));
    }

    private void autoSizeColumns(XSSFSheet sheet, int numberOfColumns) {
        for (int i = 0; i < numberOfColumns; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
