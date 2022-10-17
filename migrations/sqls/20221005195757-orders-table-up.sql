CREATE TABLE orders(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES store_users(id),
    order_status BOOLEAN NOT NULL -- 0 for active and 1 for complete.
);

--- Inserts order.
CREATE OR REPLACE FUNCTION
insert_order(_user_id UUID, _order_status BOOLEAN)
RETURNS TABLE(
    id UUID,
    user_id UUID,
    order_status BOOLEAN
) AS
$$
BEGIN
    RETURN QUERY
    INSERT INTO orders(user_id, amount_of_unique_items, order_status)
    VALUES(_user_id,  _order_status)
    RETURNING *;
END
$$
LANGUAGE 'plpgsql';
