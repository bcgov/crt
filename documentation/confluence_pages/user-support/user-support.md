---
source: [User Support](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302838/User+Support)
last_updated: 2026-05-08
---

# User Support

## Related business support pages

- [Frequently Asked Questions (FAQ)](faq.md)
- [Tech Ops](tech-ops/tech-ops.md)
- [CRT End User's Guide](end-user-guide/)

## Project Team

- The list of the 1.0 release project team members can be found here - [Project Team - Phase 1](../project-overview/project-team-phase-1.md)

## Operational tasks

Once in operation the applications usually need support for the following activities:

- Maintaining the application's technology stack - Making updates and/or changes to supporting technologies, this may extend to this application's integration.
- Incidents/Bug fixes - incidents related to application behavior that is not consistent with the expectations
- Enhancements - addition-of/improvement-on functionality to improve the user-experience and/or utility of the application for its end users.

## Raising Operations issues

All application users should connect with the Product and/or Business Owner for bugs and/or enhancement requests to support the CRT application. Depending on the nature of request the Product/Business Owner may choose the appropriate client support path.

## Client Support

Ideally users should funnel their requests to client services through a designated individual(s) - usually the product owner and/or the product sponsor.

To contact client service please send an email to [TRANIT@gov.bc.ca](mailto:TRANIT@gov.bc.ca), this will generate a Transportation Helpdesk (TH) ticket. Once a TH ticket is created it will be routed to the appropriate team.

### Application Access Request

Please note: All application requests should go to the System Administrators or District/Region Administrators within the business group.

Only in the event an administrator is not available within the business area client services would direct the access request to the System Administrator within IMB for access request.

Client services may also be able to provide information to the application users for the known issues, also listed in the LOB list and for the convenience of users this information is also available in [CRT End User's Guide](end-user-guide/).

### Report server access

The users will need to be added to the appropriate security groups for access to Power BI report server (CRT folder):

- TRAN_AP_PBIRS_CRT_BRWS_ALL (PRD)
- TRAN_AP_PBIRS_CRT_BRWS_ALL_UAT (UAT)

Elevated permissions, such as analyst and publisher, may be granted to users on business area request and confirmation with the data team (the ticket should be forwarded to the *data que*). For all accounts and security groups see [System Accounts and Services](../technical-documentation/system-accounts-and-services.md).

## Operations Support

#### Routine Activities

- Any platform wide updates are rolled out by BC DevExchange, or IMB is informed about the necessary changes that have to be made.
- When a security vulnerability is identified, and IMB resources are made aware (for example by an OCIO bulletin, github notification etc.) then the issue is assessed and the appropriate remedial action will be taken.
- The application uses various accounts to integrate with various components - [System Accounts and Services](../technical-documentation/system-accounts-and-services.md), the passwords to these accounts will have to be changed periodically (see [Service Account - Password change procedure](tech-ops/service-account-password-change.md)).

Note: Most of these activities may occur without the knowledge of end users, but if a change can potentially disrupt service the administrators should be informed of the possible outage.

#### Incidents/Bug fixes

An incident/Bug refers to application feature that is not working as expected or hinders the use of application by the end user. Examples of such behavior could be - a submitted field not validated properly or an application crash causing the eligible users to not be able to access the application.

- The users should reach out to the Product Owner or one of the business application administrators to ensure that the incident is actually a bug.
- Once confirmed an incident should be brought to IMB's attention for further investigation and resolution by the administrator. They can do so by sending an email to [TRANIT@gov.bc.ca](mailto:TRANIT@gov.bc.ca), with the following details:
  - Please include application name "CRT" in the subject line with short description
  - In the body of the email please include as much details as possible, including steps to reproduce the problem.
  - Wherever possible include screenshots and/or any other attachments needed to reproduce the issue.
  - Operations team will usually reach out to the person who raised the incident for further queries, but if there are other people that they may need to contact, or the ticket is being raised on behalf of someone else please include the contact information of additional parties as well (if possible).
- All Incidents reported via TRAN IT come via a Transportation Helpdesk (TH) ticket. When the issue is being investigated in detail it is possible that the ticket might be transferred to CRT project by the relevant Operations/Tech OPS team member.
- If the action(s) needed to resolve the issue require funding, such as use of contracted resources, appropriate funding approval needs to be obtained and the Client Business Consultant (CBC) should be informed. On the business side the financial approval will be given by the Business Owner.

## Enhancement

#### Raising enhancement requests

- These requests should be raised with the Product owner who can then prioritize and send them to [TRANIT@gov.bc.ca](mailto:TRANIT@gov.bc.ca), or raise directly with the CBC.
- For resources to be allocated to an enhancement release the business needs to bring the request to the CBC who, after a preliminary discovery session, would present the project to the Project Review Committee (PRC) to assess priority.
- Once the release is approved by the (PRC) resources can be allocated to work on it, as per availability and/or priority.

Note: Whenever a request for application enhancement is being considered, it would be ideal to have a technical review of the application's technology stack and, if applicable, bring forward the need for upgrades to the business and include them in the enhancement release (once the business approves, and it has been identified that no other project/team is conducting these enhancements).

#### Post-enhancement documentation

- After each release please ensure the documentation is updated in Confluence for all relevant pages, please pay particular attention to various sections of the following:
  - Release Details
  - System Definition
  - Technical Documentation
  - Development
  - User Support
