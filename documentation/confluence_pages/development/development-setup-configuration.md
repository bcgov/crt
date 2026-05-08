---
source: [Development Setup & Configuration](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302650/Development+Setup+Configuration)
last_updated: 2026-05-08
---

# Development Setup & Configuration

The following guide is intended to expedite a development environment setup on a local workstation.

## Development Tools

> Installation and setup of Tools will not be covered, unless necessary

This guide assumes that your workstation is running Windows 10 & already setup with the following tools at a minimum:

- Visual Studio 2019 (or higher)
- NodeJS v10+
- .Net 5.0 SDK
- MS SQL Management Studio 17 (or higher)

Additional tools that may be used:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git for Windows](https://git-scm.com/downloads)
- [Postman](https://www.postman.com/downloads/)
- [OC tools](https://www.openshift.com/blog/installing-oc-tools-windows)

## Getting the Codebase

### Git Configuration

If you do not already have Git installed on your workstation you will need to install it. Recommended: [GitHub Desktop](https://desktop.github.com/) or [Sourcetree](https://www.sourcetreeapp.com/).

If you do not already have an existing GitHub account you can create one [here](https://github.com/join). If you are creating a new account you will need to make sure that you are provided access to the CRT repository.

Once you've created your account you will need to use [these steps](https://help.github.com/en/github/authenticating-to-github/configuring-two-factor-authentication) to configure it for 2 Factor Authentication.

Now that Git is installed and you have an account created with 2 factor it needs to be configured with your Github account (see below).

```bash
git config --global user.email "your.email@gov.bc.ca"
git config --global user.name "Your Name"
```

### Forking the code repository

Open the CRT repository in your web browser (https://github.com/bcgov/CRT/). Referenced going forward as ***upstream***.

Click the Fork button in the top right, this will create & navigate you to your Fork of the CRT repo. Referenced going forward as ***origin***.

From your forked version (origin) click the Clone or Download button, you'll get a popup with an https url in it. Copy the url.

Open a command prompt (*you can use basic cmd, powershell or git bash for these commands*) and navigate to a location you want to work from and clone the origin repository down. Referenced going forward as ***local***.

```bash
git clone https://github.com/YourUserName/CRT.git
```

Navigate into the CRT that was created when you cloned the ***origin*** repo and confirm its remote links:

```bash
git remote -v
> origin https://github.com/YourUserName/CRT.git (fetch)
> origin https://github.com/YourUserName/CRT.git (push)
```

Now we create remote links to ***upstream*** with the following command so that going forward we can rebase and keep our fork in sync.

```bash
git remote add upstream https://github.com/bcgov/CRT.git
```

Now when you use remote -v you should see 4 entries, 2 for ***origin*** and 2 for ***upstream***.

The code base is now ready to start using.

## Setting up the Database

See [Database Setup](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302754) page for details.

## Project Configuration

Open Visual Studio 2019 and on the splash screen select "Open a Project or Solution"

Browse to where you checked out the CRT project root and open the /api/ folder and select the CRT.sln

### API Server Configuration

You can use either the launchSettings or appSettings for the API server configuration.

You will need to create the `appSettings.Development.json` in project root using the configuration below, this file is added to the .gitignore so it's recommended to use this for any configuration changes.

You can leave the CONNECTION_STRING defaulted to localdb or update it to connect to a different database.

```json
{
  "ConnectionStrings": {
    "CRT": "Server=(localdb)\\mssqllocaldb;Database=CRT_DEV;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "JWT": {
    "Authority": "https://dev.oidc.gov.bc.ca/auth/realms/<realmid>",
    "Audience": "<app-id>"
  },
  "ServiceAccount": {
    "User": "<ServiceAccount:User>",
    "Password": "<ServiceAccount:Password>",
    "Server": "<Server>",
    "Port": "<Port>"
  },
  "Router": {
    "Url": "https://router.api.gov.bc.ca/directions.json",
    "ApiKey": "ApiKey"
  },
  "Geocoder": {
    "Url": "https://geocoder.api.gov.bc.ca/addresses.json",
    "ApiKey": "<ApiKey>"
  },
  "GeoServerDEV": {
    "Url": "https://devoas4.apps.th.gov.bc.ca",
    "Path": "ogs-geoV06/ows?"
  },
  "GeoServerTST": {
    "Url": "https://tstoas5.apps.th.gov.bc.ca",
    "Path": "ogs-geoV06/ows?"
  },
  "GeoServerUAT": {
    "Url": "https://tstoas5.apps.th.gov.bc.ca",
    "Path": "ogs-geoV06/ows?"
  },
  "GeoServerPRD": {
    "Url": "https://prdoas5.apps.th.gov.bc.ca/ogs-geoV06",
    "Path": "ogs-geoV06/ows?"
  },
  "DataBC": {
    "Url": "https://openmaps.gov.bc.ca",
    "Path": "geo/ows?"
  }
}
```

### Frontend Configuration

When running the client locally for development, you will need to create a file called `.env.development.local` in the client project root.

Make sure to update the REACT_APP_API_HOST value to match the port your API is running on.

```
REACT_APP_API_HOST=http://localhost:27238
REACT_APP_SSO_HOST=https://dev.oidc.gov.bc.ca/auth
REACT_APP_SSO_CLIENT=<app-id>
REACT_APP_SSO_REALM=<realm-id>
REACT_APP_DEFAULT_PAGE_SIZE_OPTIONS=2,4,16,200
REACT_APP_DEFAULT_PAGE_SIZE=2
```

## Running the Project

### Running the API Server and Hangfire Server

Once the configuration is complete you can run the backend.

Ensure that your run settings are correct; Solution: Debug, Platform: Any CPU, Startup Project: Crt.Api. Then select IIS Express and click Start.

Your perspective will switch to the Debug view and a browser window will open that will initiate the back end.

You can now run the UI or use a tool like Postman to make calls against the API.

### Running the UI

Once you have configured the frontend via the `.env.development.local` you can start the client using the following command:

```bash
npm install
npm start
```
