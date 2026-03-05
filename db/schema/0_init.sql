CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    is_active BOOLEAN NOT NULL,
    is_superuser BOOLEAN NOT NULL,
    is_verified BOOLEAN NOT NULL,
    last_verify_request TIMESTAMP WITH TIME ZONE
);

CREATE TABLE venue (
    venue_id SERIAL PRIMARY KEY,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    UNIQUE (venue_name, venue_address)
);

CREATE TABLE visit (
    visit_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    venue_id INTEGER NOT NULL,
    visit_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id)
);