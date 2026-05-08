---
source: [Environment Descriptions](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302652/Environment+Descriptions)
last_updated: 2026-05-08
---

# Environment Descriptions

## Description

The IMB has standardized on the environments used for solution delivery and their naming conventions. Following is the list of the standard environments used in the CRT project.

### Development

**Short form:** DEV

**Description:** This environment is owned and managed by the development team. They have full access to configure and develop software in this environment. Developers create, deploy and debug code and conduct unit tests in this environment. Interfaces with other systems, data conversion scripts and reports are also developed in this environment. For environments where DEV and TST are currently on shared infrastructure, the proper safeguards must be in place for developers. Otherwise, the infrastructure must be separate from TST.

### Test

**Short form:** TST

**Description:** This environment is owned and managed by the organization. All types of testing are executed in this environment (integration, functional, regression etc.) except for User Acceptance Testing (UAT). This environment is also used to ensure design models have been adhered to. This environment must have the appropriate test data in the data system to cover all test cases. Developers deliver code, database changes, scripts etc. to this environment. Any Personally Identifying Information (PII) or Sensitive Personal Information (SPI) needs to be anonymized in this environment. For environments where DEV and TST are currently on shared infrastructure, the proper safeguards must be in place for developers. Otherwise, the infrastructure must be separate from DEV.

### User Acceptance Testing

**Short form:** UAT

**Description:** This production-like environment may be owned by an organization outside of development, such as the business area. It is used for production control and quality assurance. It is used to assess compliance with business requirements through Business Validation Testing (BVT). This environment should have production like data loaded into the data system in order to verify all test cases and conduct load and performance tests. This is also where vulnerability scans should be performed. Final validation of upgrades, fixes and other changes are completed here before migrating to PRE or PRD. Any Personally Identifying Information (PII) or Sensitive Personal Information (SPI) needs to be anonymized in this environment. Infrastructure must be separated from all other environments.

### Production

**Short form:** PRD

**Description:** Production is owned by the organization. Production is the live site, the services and information are exposed to external users. This environment is accessible to Ministry employees only, with the appropriate skill set/training (i.e. developer access is not permitted). This infrastructure is completely separate from all other environments.

## Environment Indicators

| Environment | HTML Color Code for Menu | |
|-------------|-------------------------|--|
| DEV | Green (#448a38) | |
| TST | Yellow (#f9a825) | |
| UAT | Purple (#744e91) | |
| PROD | BCGov Blue | |

1. The active/selected menu item color is about 10% lighter than the main color. Using sass the active color is generated with the `lighten($main-nav-color, 10%)` function.
2. Depends on your template. Many projects are using the standard BCGov Bootstrap template found at https://bcgov.github.io/bootstrap-theme/docs/reference/simple/

## Physical Architecture

Below is a high level diagram explaining the physical architecture for the solution.

<!-- IMAGE: image2019-9-12_8-40-57.png - Physical Architecture Diagram -->
