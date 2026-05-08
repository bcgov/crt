---
source: [DEV Deployment Instructions](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302786/DEV+Deployment+Instructions)
last_updated: 2026-05-08
---

# DEV Deployment Instructions

1. Open the CRT [GitHub](https://github.com/bcgov/HMCR)
2. Click on Branches and create a new Branch, ensure that master (or main) is selected to branch from.
3. Browse to the file `/CRT/api/Crt.Api/appsettings.json` file and edit it
4. Update the Version number found in constants to the appropriate value for the build. eg. 1.0.1
5. Commit the changes directly into the branch.
6. Browse back to the Code tab you should see a message that "This branch is 1 commit behind..."
7. Click Pull Request at the end of that statement.
8. Ensure that your new branch is being compared against the master branch.
9. Click Create Pull Request.
10. Github Actions workflow will detect the new branches PR and generate a new image set in OpenShift.
11. Verify the workflow has finished build and deployment to DEV. https://github.com/bcgov/crt/actions
12. Login to [OpenShift](https://console.pathfinder.gov.bc.ca:8443/console/project/txkggj-dev/overview) (assumes OCP4)
13. Verify the OpenShift all the new pods are deployed successfully.
14. Verify your changes using the version link → https://dev-crt.th.gov.bc.ca/version

For Test and UAT environment, follow the [Production Deployment Instructions](production-deployment-instructions.md) but choose Test or UAT environment instead.
