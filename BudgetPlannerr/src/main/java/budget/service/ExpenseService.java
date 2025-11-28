package budget.service;

import budget.model.Budget;
import budget.model.Expense;
import budget.model.User;
import budget.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private budget.repository.UserRepository userRepository;

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public Expense addExpense(User user, String month, String description, Double amount, String category, LocalDate date) {
        Budget budget = budgetService.getBudget(user, month);
        if (budget == null) {
            throw new IllegalArgumentException("No budget set for this month.");
        }

        // Update budget spent amount and get alert message
        String alert = budgetService.updateSpentAmount(budget, amount);

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setBudget(budget);
        expense.setDescription(description);
        expense.setAmount(amount);
        expense.setCategory(category);
        expense.setDate(date);

        expenseRepository.save(expense);

        // Optional: return alert to controller instead of just printing
        System.out.println(alert);

        return expense;
    }

    public List<Expense> getExpensesByMonth(User user, String month) {
        return expenseRepository.findByUserAndBudgetMonth(user, month);
    }

}
