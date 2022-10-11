CREATE TABLE IF NOT EXISTS order_item(
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INT DEFAULT 1
);

--- Inserts order.
CREATE OR REPLACE FUNCTION
insert_order_item(_order_id UUID, _product_id UUID, _quantity INT)
RETURNS SETOF order_item AS
$$
BEGIN
    RETURN QUERY
    INSERT INTO order_item(order_id, product_id, quantity)
    VALUES(_order_id, _product_id, _quantity)
    RETURNING *;
END
$$
LANGUAGE 'plpgsql';
