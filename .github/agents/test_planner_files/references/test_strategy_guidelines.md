# Test Strategy Guidelines

## Principles of Effective Testing
1.  **Test the User Story**: Ensure every acceptance criteria in the user story has at least one corresponding test case.
2.  **Think Negative**: Don't just test functionality. Test what happens when things go wrong (invalid input, network failure, etc.).
3.  **Boundary Value Analysis**: Test the edges of numerical ranges or string limits.

## How to Prioritize
- **High / Must Have**: Critical user flows. If this breaks, the user cannot do their job.
- **Medium / Should Have**: Important features, or error handling that prevents crashes.
- **Low / Nice to Have**: Visual polish, minor edge cases.

## Test Case Structure
- **Clear Title**: Summarize what is being tested.
- **Steps**: Be explicit but concise. (e.g. "Click 'Submit'" rather than "Navigate to the button labeled 'Submit' and press the left mouse button").
- **Expected Result**: unambiguous outcome. (e.g. "User is redirected to Dashboard", NOT "User sees success").
