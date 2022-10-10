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
PGUSER=user
PGPASSWORD=pass
PGPORT=5432
PGDATABASE=db
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

## References

[pg official docs](https://node-postgres.com/features/connecting)
