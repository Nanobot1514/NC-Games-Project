# **Northcoders House of Games API**

## **Background**

This project is an API with the intention of mimicking a real world backend service. It will be used to provide information to the front end architecture.

The database uses be PSQL, and is interacted with using [node-postgres](https://node-postgres.com/). It is hosted using [ElephantSQL](https://www.elephantsql.com/)

A version of this API is hosted at

```
https://nc-games-w79g.onrender.com/
```

Adding a path e.g **/api/reviews** to the end of the url will access different endpoints (all endpoints described in the endpoints section).

## **How to Setup**

First clone this repo using the command:

```
git clone https://github.com/Nanobot1514/NC-Games-Project.git
```

Then install all dependencies using:

**NOTE: minimum Node version of v19.3.0 and minimum Postgres version of 8.7.3 are required**

```
npm install
```

Then to connect to the database's via two .env files (.env.production & .env.test). One for the test database and one for the development database.

Like the following:

```
PGDATABASE=<my_database_test>

PGDATABASE=<my_database>
```

If for some reason this process was not followed correctly and the PGDATABASE environment variable was not set correctly, an error would be thrown such as 'PGDATABASE not set'

## **Seed the Databases**

For the development database:

```
npm run seed
```

For production:

```
npm run seed-prod
```

## **Testing**

All tests can be run using the following command:

```
npm test app.test.js
```

**AND**

```
npm test utils.test.js
```

Using **npm test** will run all tests against the test database. You can also use .only after a describe or it to run only that test.

## **Endpoints**

All currently available endpoints are as follows:

- GET /api
- GET /api/users
- GET /api/categories
- GET /api/reviews
  - GET /api/reviews/:review_id
  - PATCH /api/reviews/:review_id
- GET /api/reviews/:review_id/comments
  - POST /api/reviews/:review_id/comments

Full descriptions of all endpoints are in the **endpoints.json** file as well as the GET /api endpoint.
