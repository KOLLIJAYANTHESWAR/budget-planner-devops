package budget.controller;

import budget.model.Budget;
import budget.model.User;
import budget.service.BudgetService;
import budget.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:30000"})

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserService userService;

    // Create or update budget for the logged-in user
    @PostMapping("/")
    public ResponseEntity<?> setBudget(@RequestParam String month,
                                       @RequestParam Double limitAmount,
                                       @AuthenticationPrincipal UserDetails principal) {
        User loggedInUser = userService.getUserByUsername(principal.getUsername());
        Budget budget = budgetService.setBudget(loggedInUser, month, limitAmount);
        return ResponseEntity.ok(budget);
    }

    // Get budget for the logged-in user for a month
    @GetMapping("/")
    public ResponseEntity<?> getBudget(@RequestParam String month,
                                       @AuthenticationPrincipal UserDetails principal) {
        User loggedInUser = userService.getUserByUsername(principal.getUsername());
        Budget budget = budgetService.getBudget(loggedInUser, month);
        if (budget == null) {
            return ResponseEntity.ok("No budget set for this month");
        }
        return ResponseEntity.ok(budget);
    }
}
