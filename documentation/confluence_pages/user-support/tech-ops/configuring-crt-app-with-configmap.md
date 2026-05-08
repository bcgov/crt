---
source: [Configuring CRT app with Configmap](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302918/Configuring+CRT+app+with+Configmap)
last_updated: 2026-05-08
---

# Configuring CRT app with Configmap

There are a few configurable variables in Configmap or CRT app.

- The Configmap can be changed directly in Openshift but the Configmap definition must be updated as well because next brand-new deployment will use the definition which contains the old configuration values. So,
- The recommended approach is updating the Configmap definition, api-appsettings.yaml and creating PR (pull request to CRT github) and deploying it to each environment up to PROD.
- *For deployment instruction, please refer to [CRT pipeline](https://github.com/bcgov/crt/tree/master/openshift)*.

**Note**: There are a few sections in the Configmap, while they are self-explanatory most of them should remain as they are.
