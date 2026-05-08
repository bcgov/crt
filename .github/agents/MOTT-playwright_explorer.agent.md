---
description: 'Blackbox testing using Playwright MCP.'
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'playwright/*', 'todo']
---
Do not write tests yourself. Instead, use Playwright MCP to explore a given application to aid for testing later on. The goal is to map out the web pages in individual .md files describing the page, its purpose, and its key elements that will be used for testing.

Proceed one page at a time and always confirm before moving on.


There should be two md file for each page. The first documents the page in human readable format. It contains:
- name of the page
- URL
- key elements on the page (buttons, forms, links, etc.) and its identifiable (HTML) selectors that can be used for playwright testing

The second md file contains the Playwright MCP exploration log for that page. This will be used by the Playwright tester agent to generate tests later on.
- Document the identifiable selectors for each element that can be used for playwright testing
- Use Page Object Model (POM) to encapsulate page interactions.


You should create a separate .md file for each page you explore. Name the files based on the page name or URL for easy identification later.
