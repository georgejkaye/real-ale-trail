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

CREATE TABLE crawl (
    crawl_id SERIAL PRIMARY KEY,
    crawl_name TEXT NOT NULL UNIQUE,
    crawl_dates DATERANGE NOT NULL,
    is_public BOOLEAN NOT NULL,
    crawl_bg TEXT,
    crawl_fg TEXT
);

CREATE TABLE crawl_special_venue_type (
    crawl_special_venue_type_id SERIAL PRIMARY KEY,
    crawl_id INTEGER NOT NULL,
    display_text TEXT NOT NULL,
    FOREIGN KEY (crawl_id) REFERENCES crawl(crawl_id),
    UNIQUE (crawl_id, display_text)
);

CREATE TABLE venue (
    venue_id SERIAL PRIMARY KEY,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    UNIQUE (venue_name, venue_address)
);

CREATE TABLE crawl_venue (
    crawl_id INTEGER NOT NULL,
    venue_id INTEGER NOT NULL,
    crawl_special_venue_type_id INTEGER,
    FOREIGN KEY (crawl_id) REFERENCES crawl(crawl_id),
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id),
    FOREIGN KEY (crawl_special_venue_type_id)
        REFERENCES crawl_special_venue_type(crawl_special_venue_type_id)
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

CREATE TABLE IF NOT EXISTS venue_fact (
    venue_fact_id SERIAL PRIMARY KEY,
    venue_id INTEGER NOT NULL,
    fact_key TEXT NOT NULL,
    fact_value TEXT NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id)
);