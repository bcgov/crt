---
source: [User Management](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302624/User+Management)
last_updated: 2026-05-08
---

# User Management

## History

| Release Version | Description | Section Updated by | Feature Release Date | Developer |
|----------------|-------------|-------------------|---------------------|-----------|
| 1.0 | Initial release | Devashish Bhargava | May 26, 2021 | Young-Jin Chung/ Derek So |

## Goals (functions/sub-features)

| # | Goal / Function | Description | Story | Importance |
|---|----------------|-------------|-------|------------|
| 1 | Set up user login interface | Set up KeyCloak interface for users to login using IDIR | CRPDB-24: KeyCloak - User login through IDIR (Done) | High |
| 2 | Manage user access | Set up roles and permissions to manage user's access within the application | CRPDB-25: Manage user access - set up roles and permissions (Done) | High |
| 3 | User management interface | Screen for admins to view existing users, add new users, edit properties of existing users and disable users | CRPDB-26: User management interface - set up users and their properties (Done) | High |

### Roles and Permissions

| Roles | Code Table Read | Code Table Write | Export Read | Project Read | Project Write | Roles Read | Roles Write | Users Read | Users Write | API Client |
|-------|----------------|-----------------|-------------|--------------|---------------|------------|-------------|------------|-------------|------------|
| System Administrator | X | X | X | X | X | X | X | X | X | X |
| District Administrator | X | | X | X | X | X | | X | X | |
| Manager | X | | X | X | X | | | | | |
| Read Only | X | | X | X | | X | | X | | |

## Questions

(No questions documented)

## Future Considerations

| # | Title | Description | Priority | Related JIRA Stories/Bugs | Created User Story | Comments |
|---|-------|-------------|----------|--------------------------|-------------------|----------|
| 1 | Feedback Sprint 1 | Business area recommended improvements to make labels consistent | High | CRPDB-26 (Done) | CRPDB-79 (Done) | |

## User Interface

- User Roles
- User roles - Add/Edit
- User - Search/Add
- User - Add/Edit
