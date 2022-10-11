-- Using gen_random_uuid as per the docs of 
CREATE TABLE IF NOT EXISTS products(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    price MONEY NOT NULL,
    category TEXT
);

--- Inserts products.
CREATE OR REPLACE FUNCTION
insert_product(_name TEXT, _price MONEY, _category TEXT)
RETURNS TABLE(id UUID, name TEXT, price MONEY, category TEXT) AS
$$
BEGIN
    RETURN QUERY
    INSERT INTO products(name, price, category)
    VALUES(_name, _price, _category)
    RETURNING *;
END
$$
LANGUAGE 'plpgsql';

--- Get categorized items.
CREATE OR REPLACE FUNCTION get_product_by_category(_category TEXT)
RETURNS SETOF products AS
$$
BEGIN
    RETURN QUERY
    SELECT * FROM products WHERE products.category=_category;
END
$$
LANGUAGE 'plpgsql';
