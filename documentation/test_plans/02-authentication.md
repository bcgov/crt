# 2. Authentication

> **Preconditions for this file**: Browser session starts logged out. KeyCloak is reachable. Test IDIR accounts (`{{IDIR_VALID_USER}}`, `{{IDIR_INVALID}}`) exist per §0.7. See [00-conventions-glossary.md](00-conventions-glossary.md).

## [CRPDB-76] KeyCloak - User Login through IDIR

**User Story**: As an Application User, I want to log in using my IDIR credentials, so that I can securely access the application.

| ID | Test Scenario | Steps | Expected Result | Priority | Type |
|----|---------------|-------|-----------------|----------|------|
| TS-AUTH-01 | Invalid IDIR login | 1. Navigate to the CRT login portal<br>2. Enter `{{IDIR_INVALID}}` and any password<br>3. Submit | KeyCloak displays an authentication error and the user is NOT redirected into CRT; the URL remains on the KeyCloak login page | High | Negative |
| TS-AUTH-02 | Valid IDIR login | 1. Navigate to the CRT login portal<br>2. Enter `{{IDIR_VALID_USER}}` and `{{PASSWORD_VALID}}`<br>3. Submit | User is redirected to the CRT Project Search home screen; the logged-in user's name is visible in the top navigation | High | Functional |
