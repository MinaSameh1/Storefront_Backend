CREATE TABLE orders(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES store_users(id),
    amount_of_unique_items INT NOT NULL,
    order_status BOOLEAN NOT NULL -- 0 for active and 1 for complete.
);

--- Inserts order.
CREATE OR REPLACE FUNCTION
insert_order(_user_id UUID, _amount_of_unique_items INT, _order_status BOOLEAN)
RETURNS TABLE(
    id UUID,
    user_id UUID,
    amount_of_unique_items INT,
    order_status BOOLEAN
) AS
$$
BEGIN
    RETURN QUERY
    INSERT INTO orders(user_id, amount_of_unique_items, order_status)
    VALUES(_user_id, _amount_of_unique_items, _order_status)
    RETURNING *;
END
$$
LANGUAGE 'plpgsql';
