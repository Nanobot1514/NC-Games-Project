# Northcoders House of Games API

## Background

This project is an API with the intention of mimicking a real world backend service. It will be used to provide information to the front end architecture.

The database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## How to create the enviroment variables to run locally on your machine

First clone this repo.

Then to connect to the database's via two .env files. One for the development database and one for the test database.

Like this

```
PGDATABASE=my_database_test

PGDATABASE=my_database
```

Remember to add these files to the .gitignore so you don't the risk of senstitive information about your databases being pushed to github.

The connection.js file in this repo will set all of the environment variables from the .env file to the process.env.

If for some reason this process was not followed correctly and the PGDATABASE environment variable was not set correctly, an error would be thrown such as 'PGDATABASE not set'\_
