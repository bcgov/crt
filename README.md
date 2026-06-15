[![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)]

# Capital Rehabilitaion Project Tracking (CRT)

This web application is intended to replace the current access based tool which will soon be deprecated. This application will be an essential tool for the business areas for planning and tracking of capital and rehabilitation maintenance projects for the Ministry of Transportation and Infrastructure.

## Prerequisites

- .Net 7
- Node.JS v13.7.0 or newer
- Microsoft SQL Server 2017 or newer

## Dependencies

- Working KeyCloak Realm with BC Gov IDIR
- Ministry of Transportation and Infrastructure GeoServer access
- IDIR service account with access to LDAP service

## Local Development

### Configuration

Use the following steps to configure the local development environment

1. Clone the repository

   ```
   git clone https://github.com/bcgov/crt.git
   ```

2. Create the CRT_DEV database in MS SQL Server

   - Delete all existing tables
   - Run scripts in `database/V01.1` directory
   - Apply incremental scripts `(Vxx.x to Vxx.x)` in ascending order
   - Create the first admin user in `CRT_SYSTEM_USER` table and assign the `SYSTEM_ADMIN` role in the `CRT_USER_ROLE` table

3. Configure API Server settings

   - Copy `api/Crt.API/appsettigns.json` to `api/Crt.API/appsettigns.Development.json`
   - Update the placeholder values with real values, eg., replace the `<app-id>` with actual KeyCloak client id in the `{ "JWT": { "Audience": "<app-id>" } }` field
   - Update the connection string to match the database
   - Make note of or update the port for the API Server in Visual Studio or through the `properties/launchSettings.json` file.

4. Configure the React development settings

   - Create the `client/.env.development.local` file and add the following content

   ```
    # use port value from step 3
    REACT_APP_API_HOST=http://localhost:<api-port>

    REACT_APP_SSO_HOST=https://dev.ocid.gov.bc.ca/auth
    REACT_APP_SSO_CLIENT=<client-id>
    REACT_APP_SSO_REALM=<realm-id>

    REACT_APP_DEFAULT_PAGE_SIZE_OPTIONS=25,50,100,200
    REACT_APP_DEFAULT_PAGE_SIZE=25

    # Optional, default port is 3000
    # PORT=3001
   ```

   - Replace the placeholder values

### Run

Use the following steps to run the local development environment

1. Run the API Server

   - F5 in Visual Studio
   - Or from console

   ```
   cd api/Crt.Api
   dotnet restore
   dotnet build
   dotnet run
   ```

2. Run the React frontend
   ```
   cd client
   npm install
   npm start
   ```

## GitHub Actions Deployment

Deployments are managed through GitHub Actions and the CRT GitOps repository (`bcgov-c/tenant-gitops-2d982c`). The current deploy workflow is **CD - Update GitOps repository**, defined in `.github/workflows/argo-cd.yml`.

The deploy workflow updates the image tag in the target GitOps values file:

- `argocd/env-apps/values-dev.yaml`
- `argocd/env-apps/values-test.yaml`
- `argocd/env-apps/values-uat.yaml`
- `argocd/env-apps/values-prod.yaml`

It then promotes the `api`, `client`, and `twm` GHCR images by adding the environment tag.

### Standard Flow

1. Create a branch and open a pull request against `master`.
2. The **Build and Push to GHCR** workflow builds PR images for `api`, `client`, and `twm`.
3. To deploy the pull request to `dev`, comment `/deploy` on the pull request.
4. After testing and merge, use **Create Test rc Tag** to create an `rc_*` tag and optionally deploy it to `test`.
5. To promote a release candidate to production, use **Create Production v Tag** and optionally deploy it to `prod`.

### Merge Requirements

Pull requests should not be merged until the **Builds Required** status check passes. This check waits for the full **Builds** matrix in the **Build and Push to GHCR** workflow and fails if any component image build fails, is cancelled, or is skipped unexpectedly.

Configure the `master` branch protection rule or ruleset in GitHub to require the **Builds Required** status check before merging.

### Deploy a Pull Request to Dev

Comment `/deploy` on an open pull request to deploy that pull request's images to `dev`.

The **CD - Deploy PR Comment** workflow listens for pull request comments, verifies that the commenter has repository write, maintain, or admin access, checks that `api`, `client`, and `twm` images exist for the PR tag, and then calls **CD - Update GitOps repository** with:

- `environment`: `dev`
- `tag`: `pr-<pull-request-number>`

`/deploy dev` is also accepted. Other `/deploy ...` variants are ignored by this workflow.

After the workflow updates GitOps, Argo CD must sync the change before it reaches OpenShift.

### Deploy an Existing Image Tag

Use **CD - Update GitOps repository** to deploy an existing image tag to `dev`, `test`, `uat`, or `prod`.

1. Open **Actions** in GitHub.
2. Select **CD - Update GitOps repository**.
3. Select **Run workflow**.
4. Choose the target `environment`: `dev`, `test`, `uat`, or `prod`.
5. Enter the `tag` to deploy.
6. Run the workflow.

Accepted `tag` inputs include:

- `sha-xxxxxxx`, such as `sha-a1b2c3d`
- A full or short git commit SHA, which the workflow normalizes to `sha-xxxxxxx`
- An existing image tag, such as `pr-123`, `rc_1.2.3`, or `v1.2.3`

The tag should already exist in GHCR for `api`, `client`, and `twm` before deploying.

### Create a Test Release Candidate

Use **Create Test rc Tag** to create a release candidate tag from a git commit and optionally deploy it to `test`.

1. Open **Actions** in GitHub.
2. Select **Create Test rc Tag**.
3. Select **Run workflow**.
4. Enter `build_sha` as `latest`, a git ref, a full SHA, a short SHA, or `sha-xxxxxxx`.
5. Enter `rc_tag` in the format `rc_x.y.z`, such as `rc_1.2.3`.
6. Leave `deploy_to_tst` enabled to deploy the RC tag to `test`, or disable it to only create the tag and GitHub pre-release.
7. Optionally enable `dry_run` to validate the inputs without creating tags or deploying.

This workflow creates the RC git tag, retags the `api`, `client`, and `twm` images from the matching `sha-xxxxxxx` image tag to the RC tag, creates a GitHub pre-release, and calls **CD - Update GitOps repository** when deployment is enabled.

### Promote a Production Release

Use **Create Production v Tag** to promote an existing `rc_*` tag to a production `v*` tag and optionally deploy it to `prod`.

1. Open **Actions** in GitHub.
2. Select **Create Production v Tag**.
3. Select **Run workflow**.
4. Enter the source `rc_tag`, such as `rc_1.2.3`.
5. Enable `deploy_to_prd` if the production tag should be deployed immediately.
6. Run the workflow.
