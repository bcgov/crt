---
source: [Service Account - Password change procedure](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302745/Service+Account+-+Password+change+procedure)
last_updated: 2026-05-08
---

# Service Account - Password change procedure

## Expiring service account

### Service Accounts

- Capital Rehabilitation Projects Tracking (CRT) web application authentication to Geo server and Active directory web service.
- Password for a service account in MoTI expires and should be updated regularly.
- For all accounts and services please see [System Accounts and Services](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302726)

Applies to accounts:

- IDIR\TRCRTDEV
- IDIR\TRCRTTST
- IDIR\TRCRTUAT
- IDIR\TRCRTPRD

### Change procedure

Changing the service account password is best done in conjunction with monthly Windows Update patching cycles to avoid an out-of-band service outage.

1. Notify appropriate parties of upcoming change and any potential outage, if applicable, such as the project or development teams.
2. Generate a new password for the target account, preferably using a high-bit random-key generator.
3. Document the new password in the Password Manager application.
4. Change the password in Active Directory using PowerShell (requires ActiveDirectory module).
5. Download and install the Remote Server Administration Tools for Windows 10 from https://www.microsoft.com/en-us/download/details.aspx?id=45520, or use the password change portal to update the password.
   - Example commands using a script:
     - `$oldpw = <current password> | ConvertTo-SecureString -AsPlainText -Force`
     - `$newpw = <new password> | ConvertTo-SecureString -Asplaintext -force`
     - `Get-AdUser <userID> | Set-AdAccountPassword -OldPassword $oldpw -NewPassword $newpw`
   - Using the password change portal - Update Password, ensure to include the '**IDIR\\**' when providing the ID - 'IDIR\ABCDEFGH'

6. Change the application identity password in the secret in Openshift:
   - Find and open the secret, service-account from Openshift console: https://console.apps.silver.devops.gov.bc.ca/k8s/ns/2d982c-dev/secrets/service-account-dev
   - Click Action -> Edit Secret
   - Change the password (SERVICE_PASSWORD)
   - Click Save
   - Redeploy pods that use the secret and verify each pod starts successfully – The pods that use the identity password are crt-api-[env].
   - Verify application authentication is successful with the updated credentials
   - Repeat steps 5 through 10 for each environment (DEV, TEST, UAT, and PROD)
