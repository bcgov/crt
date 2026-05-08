---
source: [Logging](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302870/Logging)
last_updated: 2026-05-08
---

# Logging

## Overview

[Serilog](https://serilog.net/) with PostgreSQL sink is used for CRT logging.

## Guidelines

- Intended audience is operations and development teams.
- Use clear and concise language.
- Use a consistent format across application components.
- Provide file based logging with other formats such as database as optional.
- Enable log rotation and size limits.
- Logging to cause no detectable performance degradation. Write logging to approved locations to avoid memory related issues that could affect the application.
- For monitoring log, please refer to the [Log Monitoring](https://moti-imb.atlassian.net/wiki/display/CRPDB/Log+Monitoring) document. Essentially, you need to port-forward the crt-logdb-{env} service in OCP and connect the database from a DB access tool (DBeaver, VS Code) in your local environment.
