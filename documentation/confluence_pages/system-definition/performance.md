---
source: [Performance](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102309743/Performance)
last_updated: 2026-05-08
---

# Performance

The performance of the solution includes non-functional requirements on the topics of responsiveness, scalability and storage requirements.

**Synchronization**

The system will be able to immediately synchronize and upload information.

**Responsiveness**

The performance standard will be a target of 3 second latency for users.

If a report takes more than 5 seconds to complete then a message must displayed to the end user. The message must provide feedback indicating that the report is running; a frozen screen is not acceptable.

**Workflow**

The system should support multi-process or multi-threaded design approaches to ensure that long-running tasks do not impede regular workflow.

**Screen Refreshes**

The system should support seamless screen transitions. There should be no manual refreshes required for the end user to obtain the most current content.
