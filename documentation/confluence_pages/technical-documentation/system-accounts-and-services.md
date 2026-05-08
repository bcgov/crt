---
source: [System Accounts and Services](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302726/System+Accounts+and+Services)
last_updated: 2026-05-08
---

# System Accounts and Services

## Application integrations

The application uses the following accounts and services:

| Environment | Service Account | Services Used |
|-------------|----------------|---------------|
| Development (DEV) | TRCRTDEV | LDAP service (TST), Geoserver (PRD) |
| Test (TST) | TRCRTTST | LDAP service (TST), Geoserver (PRD) |
| User Acceptance Test (UAT) | TRCRTUAT | LDAP service (TST), Geoserver (PRD) |
| Production (PRD) | TRCRTPRD | LDAP service (PRD), Geoserver (PRD) |

Passwords of these accounts expire and need to be updated regularly. The password update procedure can be found [here](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302745).

## Reporting services

Additionally the following service accounts and security groups are maintained by the data team for access to Power BI reporting.

### Service Accounts

| Environment | Service Account | Services Used |
|-------------|----------------|---------------|
| Development (DEV) | TRCRTRD | Power BI report server (DEV) |
| Test (TST) | TRCRTRT | Power BI report server (TST) |
| User Acceptance Test (UAT) | TRCRTRU | Power BI report server (UAT) |
| Production (PRD) | TRCRTRP | Power BI report server (PRD) |

### Security Groups

| Role | Security Group | Description |
|------|---------------|-------------|
| Analyst (Pull down the file and make edits) | TRAN_AP_PBIRS_CRT_AYST_DEV | TRAN AP PBIRS CRT Analyst All DEV |
| | TRAN_AP_PBIRS_CRT_AYST_TST | TRAN AP PBIRS CRT Analyst All TST |
| | TRAN_AP_PBIRS_CRT_AYST_UAT | TRAN AP PBIRS CRT Analyst All UAT |
| | TRAN_AP_PBIRS_CRT_AYST | TRAN AP PBIRS CRT Analyst All |
| Publisher (Pull down the file make edits and publish them to the corresponding environments) | TRAN_AP_PBIRS_CRT_PBLSH_ALL_DEV | TRAN AP PBIRS CRT Publisher ALL DEV |
| | TRAN_AP_PBIRS_CRT_PBLSH_ALL_TST | TRAN AP PBIRS CRT Publisher ALL TST |
| | TRAN_AP_PBIRS_CRT_PBLSH_ALL_UAT | TRAN AP PBIRS CRT Publisher ALL UAT |
| | TRAN_AP_PBIRS_CRT_PBLSH_ALL | TRAN AP PBIRS CRT Publisher ALL |
| Browse (Only view published reports) | TRAN_AP_PBIRS_CRT_BRWS_ALL_DEV | TRAN AP PBIRS CRT Browser ALL DEV |
| | TRAN_AP_PBIRS_CRT_BRWS_ALL_TST | TRAN AP PBIRS CRT Browser ALL TST |
| | TRAN_AP_PBIRS_CRT_BRWS_ALL_UAT | TRAN AP PBIRS CRT Browser ALL UAT |
| | TRAN_AP_PBIRS_CRT_BRWS_ALL | TRAN AP PBIRS CRT Browser ALL |
