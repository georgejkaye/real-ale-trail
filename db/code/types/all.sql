DROP TYPE IF EXISTS user_data CASCADE;
DROP TYPE IF EXISTS visit_crawl_data CASCADE;
DROP TYPE IF EXISTS user_crawl_count_data CASCADE;
DROP TYPE IF EXISTS user_count_data CASCADE;
DROP TYPE IF EXISTS venue_input_data CASCADE;
DROP TYPE IF EXISTS venue_data CASCADE;
DROP TYPE IF EXISTS crawl_venue_data CASCADE;
DROP TYPE IF EXISTS crawl_venue_visit_data CASCADE;
DROP TYPE IF EXISTS venue_visit_data CASCADE;
DROP TYPE IF EXISTS user_summary_data CASCADE;
DROP TYPE IF EXISTS user_visit_data CASCADE;
DROP TYPE IF EXISTS crawl_visit_data CASCADE;
DROP TYPE IF EXISTS user_venue_visit_data CASCADE;
DROP TYPE IF EXISTS user_venue_data CASCADE;
DROP TYPE IF EXISTS single_user_visit_data CASCADE;
DROP TYPE IF EXISTS user_follow_data CASCADE;
DROP TYPE IF EXISTS user_high_level_summary_data CASCADE;
DROP TYPE IF EXISTS insert_visit_result CASCADE;
DROP TYPE IF EXISTS visit_data CASCADE;
DROP TYPE IF EXISTS crawl_venue_short_data CASCADE;
DROP TYPE IF EXISTS crawl_data CASCADE;

CREATE TYPE user_data AS (
    user_id INTEGER_NOTNULL,
    email TEXT_NOTNULL,
    display_name TEXT_NOTNULL,
    hashed_password TEXT_NOTNULL,
    is_active BOOLEAN_NOTNULL,
    is_superuser BOOLEAN_NOTNULL,
    is_verified BOOLEAN_NOTNULL,
    last_verify_request TIMESTAMP WITH TIME ZONE
);

CREATE TYPE visit_crawl_data AS (
    crawl_id INTEGER_NOTNULL,
    crawl_name TEXT_NOTNULL
);

CREATE TYPE venue_visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    user_display_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data[]
);

CREATE TYPE crawl_venue_visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    user_display_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT
);

CREATE TYPE venue_input_data AS (
    venue_name TEXT_NOTNULL,
    venue_address TEXT_NOTNULL,
    latitude DECIMAL_NOTNULL,
    longitude DECIMAL_NOTNULL
);

CREATE TYPE venue_data AS (
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    venue_address TEXT_NOTNULL,
    latitude DECIMAL_NOTNULL,
    longitude DECIMAL_NOTNULL,
    visits venue_visit_data[]
);

CREATE TYPE crawl_venue_data AS (
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    venue_address TEXT_NOTNULL,
    latitude DECIMAL_NOTNULL,
    longitude DECIMAL_NOTNULL,
    visits crawl_venue_visit_data[]
);

CREATE TYPE user_visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    user_display_name TEXT_NOTNULL,
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data[]
);

CREATE TYPE crawl_visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    user_display_name TEXT_NOTNULL,
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT
);

CREATE TYPE user_venue_visit_data AS (
    visit_id INTEGER_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data[]
);

CREATE TYPE user_venue_data AS (
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    venue_address TEXT_NOTNULL,
    latitude DECIMAL_NOTNULL,
    longitude DECIMAL_NOTNULL,
    visits user_venue_visit_data[]
);

CREATE TYPE single_user_visit_data AS (
    visit_id INTEGER_NOTNULL,
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data[]
);

CREATE TYPE user_summary_data AS (
    user_id INTEGER_NOTNULL,
    display_name TEXT_NOTNULL,
    visits single_user_visit_data[]
);

CREATE TYPE user_crawl_count_data AS (
    crawl_id INTEGER_NOTNULL,
    crawl_name TEXT_NOTNULL,
    visit_count INTEGER_NOTNULL,
    unique_visit_count INTEGER_NOTNULL,
    favourite_venue TEXT
);

CREATE TYPE user_count_data AS (
    user_id INTEGER_NOTNULL,
    display_name TEXT_NOTNULL,
    crawls user_crawl_count_data[]
);

CREATE TYPE insert_visit_result AS (
    visit_id INTEGER_NOTNULL
);

CREATE TYPE visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data[]
);

CREATE TYPE crawl_venue_short_data AS (
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL
);

CREATE TYPE crawl_data AS (
    crawl_id INTEGER_NOTNULL,
    crawl_name TEXT_NOTNULL,
    crawl_dates DATERANGE_NOTNULL,
    is_public BOOLEAN_NOTNULL,
    crawl_bg TEXT,
    crawl_fg TEXT,
    venues crawl_venue_short_data[]
);