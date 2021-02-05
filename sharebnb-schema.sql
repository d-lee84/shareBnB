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
    photo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
    host_id INTEGER REFERENCES users
);

CREATE TABLE message_threads (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings,
    host_id INTEGER REFERENCES users,
    guest_id INTEGER REFERENCES users,
    started_at timestamp DEFAULT NOW()
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    to_id INTEGER REFERENCES users,
    from_id INTEGER REFERENCES users,
    thread_id INTEGER REFERENCES message_threads,
    content TEXT NOT NULL,
    sent_at timestamp DEFAULT NOW()
);
