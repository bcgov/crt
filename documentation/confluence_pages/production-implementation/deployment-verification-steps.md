---
source: [Deployment Verification Steps (Please update for HMCR)](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302762/Deployment+Verification+Steps+Please+update+for+HMCR)
last_updated: 2026-05-08
---

# Deployment Verification Steps (Please update for HMCR)

**Check Deployment Scope**

- DevOps send out notification that release is going to take place, request user to sign out from TST site.
- Dev/DB check in code with proper tags, which should include the Jira ID and descriptions while check in the updates.
- DevOps create new branches and run Jenkins scripts to deploy the new build.

<!-- MACRO: Preview unavailable (attached file) -->

- QA check the history of the SVN branches to make sure the scope is property covered in this deployment.

**Sanity Testing after Deployment**

| Verification Activity | Expected Outcome | Pass/Fail |
|---|---|---|
| Verify login via IDIR (I typically start with Chrome) | Login executes without errors | |
| Verify general display | No visual errors in display; Hyperlinks work correctly: British Columbia logo, Home, About gov.bc.ca, Disclaimer, Privacy, Accessibility, Copyright, Contact Us | |
| Verify Weather Stations View, Create, Edit and Delete features | Admin can view, create, edit and delete Weather Station | |
| Verify Data Graphs #1 (Weather Station: 35094 Irishman Creek, Graph view: Weather Profile, End date: Between 2018-6-27 to 2018-12-31) | Data Graph should display chart for Air Temperature (°C) and Humidity (%) | |
| Verify Observation Type View, Create, Edit and Delete features | Admin can view, create, edit and delete Observation Type | |
| Log Out | Clicking Log Out successfully completes logout | |
| Other Browser(s) | Login executes without errors | |
