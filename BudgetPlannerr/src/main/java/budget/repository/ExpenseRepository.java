package budget.repository;

import budget.model.Expense;
import budget.model.User;
import budget.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Find all expenses for a specific budget
    List<Expense> findByBudget(Budget budget);

    // Find all expenses for a user for a specific budget month
    @Query("SELECT e FROM Expense e WHERE e.user = :user AND e.budget.month = :month")
    List<Expense> findByUserAndBudgetMonth(@Param("user") User user, @Param("month") String month);
}
