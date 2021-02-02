
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
