# Storefront Backend Project

A project required for udaicty nano degree.  
I have been tasked with creating an online storefront, to show case products, browse them, add products to order and they can view the order
in a page, I did the backend.

It is a Nodejs express API and postgres as database.

## Running/testing the API

To run the api, copy the `.env.example` file to `.env.development` or `.env.production` for dev and prod respectfully, and set the variables as needed.

```.env
# .env.example
## Note: `silent` will make it not output anything, recommend for tests.
LOG_LEVEL=info
# user vars
SALT_ROUNDS=10
BCRYPT_PASS=pass
TOKEN_SECRET=secret
# Database vars
PGPORT=5432
PGHOST=localhost
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=db # Change this in different .env files for different dbs!
```

**Important notice**: Tests won't run without a .env.test file!!!!!!!  
Db-migrate loads custom dotenv paths as well ([Beta feature](https://github.com/db-migrate/node-db-migrate/issues/517))  
So create the .env files (3, one for each node_env) depending on your need.

#### Production

```
cp .env.example .env.production # edit it and set env vars
yarn install
yarn run migrate:prod:up
yarn build
yarn start
```

#### Development

```
cp .env.example .env.development # edit it and set env vars
yarn install
yarn run migrate:dev:up
yarn dev
```

#### Tests

```
cp .env.example .env.test # edit it and set env vars
yarn run test
```

## Endpoints

| Endpoint          | method | brief description                                                                                   |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------- |
| /api/ping         | get    | Checks if api is working returns 200                                                                |
| /api/products     | post   | creates product requires name and price                                                             |
| /api/products     | get    | gets products, supports pagination using limit and page and filtering using category (all queries). |
| /api/products/:id | get    | get a product using id                                                                              |

## Examples

- Example for getting products with all queries

```get /api/product
GET /api/product?limit=1&page=2&category=test
```

## References

[pg official docs](https://node-postgres.com/features/connecting)  
[gen_random_uuid and uuid_generate_v4](https://dba.stackexchange.com/questions/205902/postgresql-two-different-ways-to-generate-a-uuid-gen-random-uuid-vs-uuid-genera)  
[Typescript style guide](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined)  
[Udaicty style guide](https://udacity.github.io/frontend-nanodegree-styleguide/javascript.html)
