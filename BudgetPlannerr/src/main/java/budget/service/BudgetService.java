package budget.service;

import budget.model.Budget;
import budget.model.User;
import budget.repository.BudgetRepository;
import budget.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public Budget setBudget(User user, String month, Double limitAmount) {
        Optional<Budget> existing = budgetRepository.findByUserAndMonth(user, month);
        Budget budget = existing.orElse(new Budget());
        budget.setUser(user);
        budget.setMonth(month);
        budget.setLimitAmount(limitAmount);
        if (budget.getSpentAmount() == null) budget.setSpentAmount(0.0);
        return budgetRepository.save(budget);
    }

    public Budget getBudget(User user, String month) {
        return budgetRepository.findByUserAndMonth(user, month).orElse(null);
    }

    public String updateSpentAmount(Budget budget, Double expenseAmount) {
        double spent = budget.getSpentAmount() == null ? 0.0 : budget.getSpentAmount();
        spent += expenseAmount;
        budget.setSpentAmount(spent);
        budgetRepository.save(budget);

        double limit = budget.getLimitAmount() != null ? budget.getLimitAmount() : 0.0;
        double remaining = limit - spent;
        double percent = limit > 0 ? (spent / limit) * 100 : 0;

        if (spent > limit) {
            return "🚨 Budget exceeded by " + String.format("%.2f", spent - limit);
        } else if (percent >= 90) {
            return "⚠️ 90% budget used. Only " + String.format("%.2f", remaining) + " left.";
        } else if (percent >= 75) {
            return "⚠️ 75% budget used. Only " + String.format("%.2f", remaining) + " left.";
        } else {
            return "✅ You are within budget. " + String.format("%.2f", remaining) + " left.";
        }
    }
}
