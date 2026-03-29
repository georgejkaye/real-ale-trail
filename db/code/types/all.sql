DROP TYPE IF EXISTS user_data CASCADE;
DROP TYPE IF EXISTS visit_crawl_data CASCADE;
DROP TYPE IF EXISTS user_crawl_count_data CASCADE;
DROP TYPE IF EXISTS user_count_data CASCADE;
DROP TYPE IF EXISTS crawl_input_data CASCADE;
DROP TYPE IF EXISTS venue_crawl_data CASCADE;
DROP DOMAIN IF EXISTS venue_crawl_data_notnull CASCADE;
DROP TYPE IF EXISTS venue_fact_data CASCADE;
DROP DOMAIN IF EXISTS venue_fact_data_notnull CASCADE;
DROP TYPE IF EXISTS venue_input_data CASCADE;
DROP TYPE IF EXISTS venue_data CASCADE;
DROP TYPE IF EXISTS crawl_venue_data CASCADE;
DROP TYPE IF EXISTS crawl_venue_visit_data CASCADE;
DROP TYPE IF EXISTS venue_visit_data CASCADE;
DROP TYPE IF EXISTS user_summary_data CASCADE;
DROP TYPE IF EXISTS user_visit_data CASCADE;
DROP TYPE IF EXISTS crawl_visit_data CASCADE;
DROP TYPE IF EXISTS user_venue_visit_data CASCADE;
DROP DOMAIN IF EXISTS user_venue_visit_data_notnull CASCADE;
DROP TYPE IF EXISTS user_venue_data CASCADE;
DROP TYPE IF EXISTS single_user_visit_data CASCADE;
DROP TYPE IF EXISTS user_high_level_summary_data CASCADE;
DROP TYPE IF EXISTS insert_venue_result CASCADE;
DROP TYPE IF EXISTS insert_crawl_result CASCADE;
DROP TYPE IF EXISTS insert_visit_result CASCADE;
DROP TYPE IF EXISTS visit_data CASCADE;
DROP TYPE IF EXISTS crawl_venue_short_data CASCADE;
DROP DOMAIN IF EXISTS crawl_venue_short_data_notnull CASCADE;
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

CREATE DOMAIN visit_crawl_data_notnull
AS visit_crawl_data NOT NULL;

CREATE TYPE venue_visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    user_display_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data_notnull[]
);

CREATE DOMAIN venue_visit_data_notnull
AS venue_visit_data NOT NULL;

CREATE TYPE crawl_venue_visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    user_display_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT
);

CREATE TYPE crawl_input_data AS (
    crawl_name TEXT_NOTNULL,
    start_date TIMESTAMP_NOTNULL,
    end_date TIMESTAMP_NOTNULL,
    is_public BOOLEAN_NOTNULL,
    crawl_bg TEXT,
    crawl_fg TEXT
);

CREATE TYPE venue_crawl_data AS (
    crawl_id INTEGER_NOTNULL,
    crawl_name TEXT_NOTNULL,
    crawl_start TIMESTAMP WITH TIME ZONE,
    crawl_end TIMESTAMP WITH TIME ZONE
);

CREATE DOMAIN venue_crawl_data_notnull
AS venue_crawl_data NOT NULL;

CREATE TYPE venue_fact_data AS (
    fact_key TEXT_NOTNULL,
    fact_value TEXT_NOTNULL
);

CREATE DOMAIN venue_fact_data_notnull
AS venue_fact_data NOT NULL;

CREATE TYPE venue_input_data AS (
    venue_name TEXT_NOTNULL,
    venue_address TEXT_NOTNULL,
    latitude DECIMAL_NOTNULL,
    longitude DECIMAL_NOTNULL,
    crawl_ids INTEGER_NOTNULL[],
    facts venue_fact_data_notnull[]
);

CREATE TYPE venue_data AS (
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    venue_address TEXT_NOTNULL,
    latitude DECIMAL_NOTNULL,
    longitude DECIMAL_NOTNULL,
    crawls venue_crawl_data_notnull[],
    visits venue_visit_data_notnull[],
    facts venue_fact_data_notnull[]
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
    crawls visit_crawl_data_notnull[]
);

CREATE DOMAIN user_venue_visit_data_notnull
AS user_venue_visit_data NOT NULL;

CREATE TYPE user_venue_data AS (
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    venue_address TEXT_NOTNULL,
    latitude DECIMAL_NOTNULL,
    longitude DECIMAL_NOTNULL,
    crawls venue_crawl_data_notnull[],
    visits user_venue_visit_data_notnull[]
);

CREATE TYPE single_user_visit_data AS (
    visit_id INTEGER_NOTNULL,
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data_notnull[]
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

CREATE TYPE insert_venue_result AS (
    venue_id INTEGER_NOTNULL
);

CREATE TYPE insert_crawl_result AS (
    crawl_id INTEGER_NOTNULL
);

CREATE TYPE insert_visit_result AS (
    visit_id INTEGER_NOTNULL
);

CREATE TYPE visit_data AS (
    visit_id INTEGER_NOTNULL,
    user_id INTEGER_NOTNULL,
    user_display_name TEXT_NOTNULL,
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT,
    crawls visit_crawl_data_notnull[]
);

CREATE TYPE crawl_venue_short_data AS (
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL
);

CREATE DOMAIN crawl_venue_short_data_notnull
AS crawl_venue_short_data NOT NULL;

CREATE TYPE crawl_data AS (
    crawl_id INTEGER_NOTNULL,
    crawl_name TEXT_NOTNULL,
    crawl_start TIMESTAMP WITH TIME ZONE,
    crawl_end TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN_NOTNULL,
    crawl_bg TEXT,
    crawl_fg TEXT,
    venues crawl_venue_short_data_notnull[]
);