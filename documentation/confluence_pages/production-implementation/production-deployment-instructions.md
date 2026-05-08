---
source: [Production Deployment Instructions](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302788/Production+Deployment+Instructions)
last_updated: 2026-05-08
---

# Production Deployment Instructions

- [CRT 1.0.2 PRD migration](https://moti-imb.atlassian.net/browse/TH-81803)

Deployment instructions for the CRT application using Github Actions.

**NOTE:** Deployments to DEV and TST are performed by the development team.

## OpenShift Project, Pipelines

Github Actions workflow is configured to trigger CRT system builds. When commits are made to the github [CRT repository](https://github.com/bcgov/crt), Github Actions triggers the appropriate builds to be executed and on success, deployment to the Dev environment. The Pipelines are visible in the [Github Actions page](https://github.com/bcgov/crt/actions) of the CRT Git repository. On the request of the business, a build tested on Dev can be promoted to Test and Production as needed via Github Actions.

### Automatic Deployment of CRT to Dev

CRT is configured to build and deploy each component (server, client, pdf, postgresql) based on PR to the "master" branch of the CRT github repo. For more details, please refer to https://github.com/bcgov/crt/tree/master/openshift

**Note:** Database scripts must be run manually before the automatic deployment.

### Promoting SBI to Test, Prod

A PR to the master branch will trigger Github Actions to build and deploy the SBI apps to DEV environment. In order to promote SBI apps to Test, UAT and Prod:

1. Access Github Actions via https://github.com/bcgov/crt/actions
2. Choose the workflow with the clock symbol

<!-- IMAGE: image2021-12-10_15-3-50.png - Workflow selection -->

3. In the mid right, click "review deployments"

<!-- IMAGE: image2021-12-10_15-4-16.png - Review deployments button -->

4. Check test, uat or prod and click "Approve and Deploy"

<!-- IMAGE: image2021-12-10_15-4-36.png - Approve and Deploy dialog -->

### General OpenShift Deployment Troubleshooting

- When an action in OpenShift seems to take too long (e.g. rolling deploy seems to hang), click in OpenShift on the Monitoring left side menu item, and review the "Events" column for Error Events. Click "More Details" (top right) to see full text for the Events. Filter on "Fail" to see just the fail events.
- If Build completes, but version is outdated, look to see if replication controllers are pending in Openshift. If so, delete them / close them. The build should proceed automatically. https://console.apps.silver.devops.gov.bc.ca/k8s/ns/2d982c-dev/replicationcontrollers
- In promoting to production, an error was found in the Monitoring → Event Log - "***Error syncing pod, skipping: failed to "TeardownNetwork" for....***".
  - Found a [Kubernetes enhancement reference](https://github.com/kubernetes/kubernetes/issues/26199) to the issue and a solution in the Red Hat Knowledgebase. The error is harmless and caused by a race condition between kube processes killing the network and the container during a rolling deploy - sometimes the container exits before the network is removed. It is slated to be fixed in the next release.
