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

-- CREATE TABLE jobs (
--   id SERIAL PRIMARY KEY,
--   title TEXT NOT NULL,
--   salary INTEGER CHECK (salary >= 0),
--   equity NUMERIC CHECK (equity <= 1.0),
--   company_handle VARCHAR(25) NOT NULL
--     REFERENCES companies ON DELETE CASCADE
-- );

-- CREATE TYPE state_type AS ENUM ('interested', 'applied', 'accepted', 'rejected');

-- CREATE TABLE applications (
--   username VARCHAR(25)
--     REFERENCES users ON DELETE CASCADE,
--   job_id INTEGER
--     REFERENCES jobs ON DELETE CASCADE,
--   state state_type,
--   PRIMARY KEY (username, job_id)
-- );
