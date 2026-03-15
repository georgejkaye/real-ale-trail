DROP TYPE IF EXISTS user_data CASCADE;
DROP TYPE IF EXISTS user_count_data CASCADE;
DROP TYPE IF EXISTS venue_input_data CASCADE;
DROP TYPE IF EXISTS venue_data CASCADE;
DROP TYPE IF EXISTS venue_visit_data CASCADE;
DROP TYPE IF EXISTS user_summary_data CASCADE;
DROP TYPE IF EXISTS user_visit_data CASCADE;
DROP TYPE IF EXISTS single_user_visit_data CASCADE;
DROP TYPE IF EXISTS user_follow_data CASCADE;
DROP TYPE IF EXISTS user_high_level_summary_data CASCADE;
DROP TYPE IF EXISTS insert_visit_result CASCADE;
DROP TYPE IF EXISTS visit_data CASCADE;

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

CREATE TYPE venue_visit_data AS (
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

CREATE TYPE user_visit_data AS (
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

CREATE TYPE single_user_visit_data AS (
    visit_id INTEGER_NOTNULL,
    venue_id INTEGER_NOTNULL,
    venue_name TEXT_NOTNULL,
    visit_date TIMESTAMP_NOTNULL,
    notes TEXT,
    rating INTEGER,
    drink TEXT
);

CREATE TYPE user_summary_data AS (
    user_id INTEGER_NOTNULL,
    email TEXT_NOTNULL,
    display_name TEXT_NOTNULL,
    visits single_user_visit_data[]
);

CREATE TYPE user_count_data AS (
    user_id INTEGER_NOTNULL,
    display_name TEXT_NOTNULL,
    visit_count INTEGER_NOTNULL,
    unique_visit_count INTEGER_NOTNULL
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
    drink TEXT
);