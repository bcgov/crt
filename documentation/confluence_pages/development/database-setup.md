---
source: [Database Setup](https://moti-imb.atlassian.net/wiki/spaces/CRPDB/pages/102302754/Database+Setup)
last_updated: 2026-05-08
---

# Database Setup

## Creating a blank local database

Setting up the database locally is beneficial however the initial setup of a blank database can be a bit tedious.

If you browse into /CRT/database/ folder you'll see numbered scripts.

You'll need to execute them in order in execution order. There are ways to automate this process using batch/scripts and the sqlcmd or within SSMS but those won't be covered here.

## Creating a local database from a backup

Perhaps the easiest and most practical method of setting up a local database, as it gives you a database with data and is very easy to setup.

The backup can be from either another developer or a copy of Dev/Test.

1. Open SSMS and create a new connection to your `(localdb)\MSSQLLocalDB`.
2. Expand the localdb and right click on the database folder, select "Restore Database...".
3. In the dialog select Device and click the ... button. Ensure Backup media type is "File", and click the Add button then browse to the backup files location and click Ok.
4. Ensure the destination database name is `CRT_DEV`, and click Ok to start the restore process.

## Creating a local database using Docker

This is a very simple to perform and gives developers the most flexibility as you can tag your 'releases' allowing you to easily rollback changes or restart your DB from scratch.

The easiest way to get started is to use docker-compose.

1) Create a file within the `/CRT/database/` folder and name it `Dockerfile` (no extension!)

2) Add the following text to the Dockerfile and save it:

```dockerfile
FROM mcr.microsoft.com/mssql/server:2019-latest
WORKDIR /usr/local/src/
```

3) Create a file within the `/CRT/database/` folder and name it `docker-compose.yml`

4) Open the file and add the following sample yaml to it:

```yaml
version: '3.8'

services:
  crt-db:
    build: .
    image: crt-db:ready
    container_name: crt-db
    ports:
      - "1466:1433"
    environment:
      MSSQL_SA_PASSWORD: Sample21!
      ACCEPT_EULA: Y
    volumes:
      - ./:/usr/local/src/CRT
```

**Notes:** Version 3.8 assumes your docker version is at least 19+. This compose will generate a service named crt-db and use the Dockerfile we created to generate that container and tag it initially with a crt-db:ready. It will be accessible on port 1466 so as to not conflict with any other MSSQL services you may have running. It also creates a sym link to the /CRT/databases/ folder on the container itself in /usr/local/src/CRT/

Once that is done open up a powershell or bash shell, browse to the `/CRT/databases/` folder and execute the following commands:

```bash
docker-compose build crt-db
```

Once you see "Successfully built" and "Successfully tagged" run this command:

```bash
docker-compose up -d crt-db
```

Now that we have the container setup we can create the database. Open a shell to the container:

```bash
docker exec -it crt-db bash
```

Once you have a new shell to the container execute the following commands to create the database:

```bash
mssql@local:/usr/local/src$ /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P Sample21! -Q "CREATE DATABASE CRT_DEV"
mssql@local:exit
```

At this point it's a good idea to tag the container as a blank, this way you can restart at this point anytime you want without having to perform the above steps.

```bash
docker commit crt-db crt-db:blankdb
```

Now at any point you can start from a blank CRT_DEV database.

Now to execute the scripts to create the database schema, open a shell on the container once again and execute the following command which will iterate through the scripts in the various V* folders and execute them in numbered order:

```bash
mssql@local:for dir in ./CRT/V*/; do for f in ./$dir/*.sql; do /opt/mssql-tools/bin/sqlcmd -I -S localhost -U SA -P Sample21! -i $f; done; done;
```

You'll see a number of "Change Database context" messages and (1 rows affected), as the database is created.
