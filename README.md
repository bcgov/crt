[![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)]

# Capital Rehabilitaion Project Tracking (CRT)

This web application is intended to replace the current access based tool which will soon be deprecated. This application will be an essential tool for the business areas for planning and tracking of capital and rehabilitation maintenance projects for the Ministry of Transportation and Infrastructure.

## Prerequisites

- .Net 5 SDK
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

## OpenShift Deployment

Refer to [this document](openshift/README.md) for OpenShift Deployment and Pipeline related topics

