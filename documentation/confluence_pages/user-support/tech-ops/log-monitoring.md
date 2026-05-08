---
source: [Log Monitoring](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302850/Log+Monitoring)
last_updated: 2026-05-08
---

# Log Monitoring

## Logging

There are two logging systems:

- Console logging
- Database logging - Postgresql

## Console Log

1. Log in [Openshift Console](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects)
2. Click the POD to investigate
3. Click View Log
4. Console log is deleted regularly so if you are looking for old logs, you need to look at database log

## Database Log

### Prerequisites

- Needs access to the namespace in Openshift
- [OC tools](https://www.openshift.com/blog/installing-oc-tools-windows) should be installed in user's machine
- Any tools to access Postgresql database such as [DBeaver](https://dbeaver.io/), [Sql Developer with PostgreSQL JDBC driver](https://substars.github.io/2014/01/06/oracle-sql-developer-and-postgres/) or [VS Code with PostgreSQL extension](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres)

### Monitoring

1. Log in [Openshift Console](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects)
2. Copy Login Command
   - Click user name on the right upper corner
   - Click copy login command
3. Open command line tool such as Command Prompt, Powershell or WSL
4. Paste the copy command to log in Openshift console

```bash
theuser:~$ oc login --token=sha256~TGwEcWZ1QV18ovh1kD-N6nW_qwm --server=https://api.silver.devops.gov.bc.ca:6443
Logged into "https://api.silver.devops.gov.bc.ca:6443" as "theuser@github" using the token provided. You have access to the following projects and can switch between them with 'oc project <projectname>':

2d982c-dev
2d982c-prod
* 2d982c-test
2d982c-tools

Using project "2d982c-test".
```

5. Go to the project namespace where your crt-logdb-{env} POD exists and port forward

```bash
theuser:~$ oc project 2d982c-test
Already on project "2d982c-test" on server "https://api.silver.devops.gov.bc.ca:6443".
theuser:~$ oc port-forward services/crt-logdb-test 5432:5432
Forwarding from 127.0.0.1:5432 -> 5432
Forwarding from [::1]:5432 -> 5432
```

6. Open VS Code and click PostgreSQL tab in the vertical tab panel on the left and create connection. The connection parameters are as follows:

```json
{
  "label": "localhost",
  "host": "localhost",
  "user": "postgres",
  "port": 5432,
  "ssl": false,
  "database": "serilog",
  "password": "postgres"
}
```
