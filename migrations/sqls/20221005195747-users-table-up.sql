-- I decided on this name as I was uncomfortable naming a table `users`,
-- which is close to default `user` table of postgres.
CREATE TABLE IF NOT EXISTS store_users(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    pass TEXT NOT NULL
);

--- Inserts users.
CREATE OR REPLACE FUNCTION
insert_user(_username TEXT, _firstName TEXT, _lastName TEXT, _pass TEXT)
RETURNS TABLE(
    id UUID,
    username TEXT,
    firstname TEXT,
    lastname TEXT
) AS
$$
BEGIN
  RETURN QUERY
    INSERT INTO store_users(username, firstName, lastName, pass)
    VALUES(_username, _firstName, _lastName, _pass)
    RETURNING store_users.id, store_users.username, store_users.firstname, store_users.lastname;
END
$$
LANGUAGE 'plpgsql';
