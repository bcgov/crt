---
source: [Bug Management Process](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102310122/Bug+Management+Process)
last_updated: 2026-05-08
---

# Bug Management Process

The following table states when bugs should be fixed:

| Bug Priority | When to Fix |
|---|---|
| Blocker | Drop everything and Fix |
| Critical | Must be fixed before go live (ideally before the weekly QAT) |
| Major | Must either be fixed before go live, or reclassified |
| Medium/Minor/Trivial | Best Effort. If you are working on a screen where it is easy to fix a bug do it, but do not sacrifice story progression |

The basic workflow for bug fixes is as follows:

1. Tester identifies bug and assigns them to Alec
2. Its priority is confirmed
3. Blocker/Critical/Major are assigned to developer
4. Developer resolves bug
5. Developer checks in and includes JIRA ticket# and description in SVN comment
6. Code is built into DEV (either by developer, or as a regular update)
7. Developer confirms build is working in development
8. Developer changes status of bug to Testing and assigns back to tester
9. Scheduled migration to UAT occurs, and bugs are hopefully identified in release notes (this is why SVN comment is important)
10. Tester confirms bug is resolved and closes.
