# Storefront Backend Project

A project required for udaicty nano degree.  
I have been tasked with creating an online storefront, to show case products, browse them, add products to order and they can view the order
in a page, I did the backend.

It is a Nodejs express API and postgres as database.

## Running the API

to run in production, copy the `.env.example` file to `.env`, and set the variables as needed.

```.env
# .env.example
## Note: `silent` will make it not output anything
LOG_LEVEL=info
# Database vars
PGHOST=localhost
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
PGPORT=5432
POSTGRES_DB=db
```

Then install the deps and run it

```
yarn install
yarn build
yarn start
```

for Development

```
yarn install
yarn dev
```

## Endpoints

| Endpoint          | method | brief description                                                                                   |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------- |
| /api/ping         | get    | Checks if api is working returns 200                                                                |
| /api/products     | post   | creates product requires name and price                                                             |
| /api/products     | get    | gets products, supports pagination using limit and page and filtering using category (all queries). |
| /api/products/:id | get    | get a product using id                                                                              |

## References

[pg official docs](https://node-postgres.com/features/connecting)
[gen_random_uuid and uuid_generate_v4](https://dba.stackexchange.com/questions/205902/postgresql-two-different-ways-to-generate-a-uuid-gen-random-uuid-vs-uuid-genera)
