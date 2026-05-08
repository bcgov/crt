---
source: [Agile Business Validation Testing](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302720/Agile+Business+Validation+Testing)
last_updated: 2026-05-08
---

# Agile Business Validation Testing

Business Validation Testing (BVT) has two components:

- Validation of user stories/bugs
  - Confirm system meets the acceptance criteria, UI specifications and navigation as described in the user story being tested
  - Test cases are high level and are not providing step-by-step scripting
- Validation of business scenarios
  - Confirm system supports goal based scenarios and corresponding business processes
  - Test cases are high level and are goal-based scenarios

Business testers (product owner, subject matter experts, business users) use the browser(s) and device(s) they normally use for their daily work i.e., test cases are not prescriptive as to browsers/devices to use. A comment in the test case should be added by the business tester to capture what browser(s) and devices were used to execute the test.

A BVT cycle may include a combination validation of user stories/bugs and/or business scenarios.

For every BVT, BVT resource has to:

- Create Zephyr tests
- Create a test cycle
- Create folder(s) – folders are used to assign test cases to different users
- Add test cases to folder
- Execute test case from the test cycle ([CRPDB Test Cycle](https://moti-imb.atlassian.net/projects/CRPDB?selectedItem=com.thed.zephyr.je:zephyr-tests-page#test-cycles-tab))
- Use the [TST environment](https://tst-crt.th.gov.bc.ca) for functional testing
- Use the [UAT environment](https://uat-crt.th.gov.bc.ca) for business validation testing

Please click the following links to know how:

- [Create Test](https://moti-imb.atlassian.net/wiki/display/AGILE/Create+Test)
- [Create Test Cycle](https://moti-imb.atlassian.net/wiki/display/AGILE/Create+Test+Cycle)
- [Execute Test Cases, Validation of User Stories](https://moti-imb.atlassian.net/wiki/display/AGILE/Execute+Test+Cases%2C+Validation+of+User+Stories)
- [View Test Execution Summary](https://moti-imb.atlassian.net/wiki/display/AGILE/View+Test+Execution+Summary)

## Stories Currently in FT

<!-- MACRO: Jira issue list - Stories currently in Functional Testing -->
