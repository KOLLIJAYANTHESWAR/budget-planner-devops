package budget.controller;

import budget.model.Expense;
import budget.model.User;
import budget.service.ExpenseService;
import budget.service.UserService;
import budget.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import budget.dto.ExpenseRequest;
import java.time.LocalDate;
import java.util.List;
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:30000"})

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Add new expense
    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {

        User loggedInUser = userService.getUserByUsername(userDetails.getUsername());

        if (loggedInUser == null) {
            return ResponseEntity.status(403).body("User not authenticated");
        }

        LocalDate expenseDate;
        try {
            expenseDate = LocalDate.parse(request.getDate().trim());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use yyyy-MM-dd.");
        }

        Expense expense = expenseService.addExpense(
                loggedInUser,
                request.getMonth(),
                request.getDescription(),
                request.getAmount(),
                request.getCategory(),
                expenseDate
        );
        return ResponseEntity.ok(expense);
    }


    // Get all expenses for logged-in user in a month
    @GetMapping
    public ResponseEntity<?> getExpenses(@RequestParam String month,
                                         @AuthenticationPrincipal UserDetails userDetails) {

        User loggedInUser = userService.getUserByUsername(userDetails.getUsername());
        List<Expense> expenses = expenseService.getExpensesByMonth(loggedInUser, month);

        if (expenses.isEmpty()) {
            return ResponseEntity.ok("No expenses found for " + month);
        }
        return ResponseEntity.ok(expenses);
    }
}
