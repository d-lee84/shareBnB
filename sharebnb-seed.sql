-- both test users have the password "password"
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    price NUMERIC(6, 2) NOT NULL, 
    zipcode VARCHAR(10) NOT NULL,
    capacity INTEGER CHECK (capacity < 13),
    description TEXT,
    amenities TEXT,
    photo_url TEXT,
    host_id INTEGER REFERENCES users
);


INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@joelburton.com',
        TRUE);

INSERT INTO listings (
                name,
                price, 
                zipcode,
                capacity,
                description,
                amenities,
                photo_url,
                host_id
            )
VALUES ('test-listing', 199.99, '94705', 11, 'Best place in Berkeley!', 'Pool', null, 1),
       ('The Spot', 99, '94602', 6, 'Favorite goto spot in Oakland', 'Spa', null, 2);
