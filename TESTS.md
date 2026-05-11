# Automated Tests

This project includes a suite of automated tests focusing on the core value proposition: the **Audit Engine**. We use `Vitest` for fast, reliable unit testing.

## How to Run Tests

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the test suite:
   ```bash
   npm test
   ```

## Test Coverage

### Audit Engine (`server/tests/auditEngine.test.js`)

| Test Case                        | Description                                                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Downgrade Recommendation**     | Verifies that a small team (e.g., 5 seats) on an Enterprise plan is correctly prompted to downgrade to a Pro/Business plan.               |
| **Redundant Chat Assistants**    | Ensures that if a user is paying for both ChatGPT and Claude, the engine flags this as a consolidation opportunity.                       |
| **Redundant Coding Assistants**  | Verifies that using both Cursor and Copilot triggers a recommendation to standardize on one tool.                                         |
| **Optimized Stack Verification** | Ensures that a user already on the correct plans (e.g., Team plan for 50 users) receives a "You're spending well" message with 0 savings. |
| **Excessive API Spending**       | Checks if monthly API spends over $500 trigger optimization recommendations (e.g., semantic caching).                                     |
