# API Requirements

This file is from [the official project repo](https://github.com/udacity/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter/blob/master/REQUIREMENTS.md)

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `GET /api/product`
- Show `GET /api/product/:uuid`
- Create [token required] `POST /api/product`
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category) `GET /api/product?category=productCategory`

#### Users

- Index [token required] `GET /api/user`
- Show [token required] `GET /api/user/:uuid`
- Create N[token required] `POST /api/user`

#### Orders

- Current Order by user (args: user id)[token required] `GET /api/order/active`
- [OPTIONAL] Completed Orders by user (args: user id)[token required] `GET /api/order/user` (for users add :userId to the route.)

## Data Shapes

#### Product

- id
- name
- price
- category

#### User

- id
- username (added)
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
