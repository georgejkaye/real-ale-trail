DROP FUNCTION IF EXISTS insert_user;
DROP FUNCTION IF EXISTS insert_venue;
DROP FUNCTION IF EXISTS insert_venues;
DROP FUNCTION IF EXISTS insert_visit;
DROP FUNCTION IF EXISTS update_visit;
DROP FUNCTION IF EXISTS select_user_by_user_id;
DROP FUNCTION IF EXISTS select_user_by_email;
DROP FUNCTION IF EXISTS select_venues;
DROP FUNCTION IF EXISTS select_venues_by_user;
DROP FUNCTION IF EXISTS select_visits;
DROP FUNCTION IF EXISTS select_visit;
DROP FUNCTION IF EXISTS select_user_summary;
DROP FUNCTION IF EXISTS select_user_counts;
DROP FUNCTION IF EXISTS update_user;
DROP FUNCTION IF EXISTS update_user_display_name;
DROP FUNCTION IF EXISTS delete_user;

CREATE OR REPLACE FUNCTION insert_user (
    p_email TEXT,
    p_display_name TEXT,
    p_hashed_password TEXT
)
RETURNS user_data
LANGUAGE sql
AS
$$
INSERT INTO app_user (
    email,
    display_name,
    hashed_password,
    is_active,
    is_superuser,
    is_verified
)
VALUES (
    p_email,
    p_display_name,
    p_hashed_password,
    TRUE,
    FALSE,
    FALSE
)
RETURNING (
    user_id,
    email,
    display_name,
    hashed_password,
    is_active,
    is_superuser,
    is_verified,
    last_verify_request)
$$;

CREATE OR REPLACE FUNCTION insert_venue (
    p_venue_name TEXT,
    p_address TEXT,
    p_latitude DECIMAL,
    p_longitude DECIMAL
)
RETURNS INTEGER
LANGUAGE sql
AS
$$
INSERT INTO venue (
    venue_name,
    venue_address,
    latitude,
    longitude
)
VALUES (
    p_venue_name,
    p_address,
    p_latitude,
    p_longitude
)
ON CONFLICT (venue_name, venue_address) DO UPDATE
SET
    venue_name = p_venue_name,
    venue_address = p_address,
    latitude = p_latitude,
    longitude = p_longitude
RETURNING venue_id;
$$;

CREATE OR REPLACE FUNCTION insert_venues (
    p_venues venue_input_data[]
)
RETURNS VOID
LANGUAGE sql
AS
$$
INSERT INTO venue (
    venue_name,
    venue_address,
    latitude,
    longitude
)
SELECT
    v_venue.venue_name,
    v_venue.venue_address,
    v_venue.latitude,
    v_venue.longitude
FROM UNNEST(p_venues) AS v_venue
ON CONFLICT (venue_name, venue_address) DO NOTHING
$$;

CREATE OR REPLACE FUNCTION insert_visit (
    p_user_id INTEGER,
    p_venue_id INTEGER,
    p_visit_date TIMESTAMP WITH TIME ZONE,
    p_notes TEXT,
    p_rating INTEGER,
    p_drink TEXT
)
RETURNS insert_visit_result
LANGUAGE sql
AS
$$
INSERT INTO visit (
    user_id,
    venue_id,
    visit_date,
    notes,
    rating,
    drink
)
VALUES (
    p_user_id,
    p_venue_id,
    p_visit_date,
    p_notes,
    p_rating,
    p_drink
)
RETURNING visit_id AS new_visit_id;
$$;

CREATE OR REPLACE FUNCTION update_visit (
    p_user_id INTEGER,
    p_visit_id INTEGER,
    p_notes TEXT,
    p_rating INTEGER,
    p_drink TEXT
)
RETURNS VOID
LANGUAGE sql
AS
$$
UPDATE visit
SET
    notes = p_notes,
    rating = p_rating,
    drink = p_drink
WHERE visit_id = p_visit_id
AND user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION select_user_by_user_id (
    p_user_id INTEGER
)
RETURNS SETOF user_data
LANGUAGE sql
AS
$$
SELECT
    app_user.user_id,
    app_user.email,
    app_user.display_name,
    app_user.hashed_password,
    app_user.is_active,
    app_user.is_superuser,
    app_user.is_verified,
    app_user.last_verify_request
FROM app_user
WHERE app_user.user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION select_user_by_email (
    p_email TEXT
)
RETURNS SETOF user_data
LANGUAGE sql
AS
$$
SELECT
    app_user.user_id,
    app_user.email,
    app_user.display_name,
    app_user.hashed_password,
    app_user.is_active,
    app_user.is_superuser,
    app_user.is_verified,
    app_user.last_verify_request
FROM app_user
WHERE app_user.email = p_email;
$$;

CREATE OR REPLACE FUNCTION select_venues ()
RETURNS SETOF venue_data
LANGUAGE sql
AS
$$
SELECT
    venue.venue_id,
    venue.venue_name,
    venue.venue_address,
    venue.latitude,
    venue.longitude,
    COALESCE(venue_visit.visits, ARRAY[]::venue_visit_data[]) AS visits
FROM venue
LEFT JOIN (
    SELECT
        visit_view.venue_id,
        ARRAY_AGG(
            (
                visit_view.visit_id,
                visit_view.user_id,
                visit_view.display_name,
                visit_view.visit_date,
                visit_view.notes,
                visit_view.rating,
                visit_view.drink,
                visit_view.crawls
            )::venue_visit_data
        ) AS visits
    FROM visit_view
    GROUP BY visit_view.venue_id
) venue_visit
ON venue.venue_id = venue_visit.venue_id
ORDER BY venue.venue_name ASC;
$$;

CREATE OR REPLACE FUNCTION select_venues_by_crawl_id (
    p_crawl_id INTEGER_NOTNULL
)
RETURNS SETOF crawl_venue_data
LANGUAGE sql
AS
$$
SELECT
    venue.venue_id,
    venue.venue_name,
    venue.venue_address,
    venue.latitude,
    venue.longitude,
    COALESCE(venue_visit.visits, ARRAY[]::crawl_venue_visit_data[]) AS visits
FROM venue
LEFT JOIN (
    SELECT
        visit_view.venue_id,
        ARRAY_AGG(
            (
                visit_view.visit_id,
                visit_view.user_id,
                visit_view.display_name,
                visit_view.visit_date,
                visit_view.notes,
                visit_view.rating,
                visit_view.drink
            )::crawl_venue_visit_data
        ) AS visits
    FROM visit_view
    INNER JOIN crawl_visit
    ON visit_view.visit_id = crawl_visit.visit_id
    WHERE crawl_visit.crawl_id = p_crawl_id
    GROUP BY visit_view.venue_id
) venue_visit
ON venue.venue_id = venue_visit.venue_id
INNER JOIN crawl_venue
ON venue.venue_id = crawl_venue.venue_id
WHERE crawl_venue.crawl_id = p_crawl_id
ORDER BY venue.venue_name ASC;
$$;


CREATE OR REPLACE FUNCTION select_venue_by_venue_id (
    p_venue_id INTEGER_NOTNULL
)
RETURNS SETOF venue_data
LANGUAGE sql
AS
$$
SELECT
    venue.venue_id,
    venue.venue_name,
    venue.venue_address,
    venue.latitude,
    venue.longitude,
    COALESCE(venue_visit.visits, ARRAY[]::venue_visit_data[]) AS visits
FROM venue
LEFT JOIN (
    SELECT
        visit_view.venue_id,
        ARRAY_AGG(
            (
                visit_view.visit_id,
                visit_view.user_id,
                visit_view.display_name,
                visit_view.visit_date,
                visit_view.notes,
                visit_view.rating,
                visit_view.drink,
                visit_view.crawls
            )::venue_visit_data
        ) AS visits
    FROM visit_view
    GROUP BY visit_view.venue_id
) venue_visit
ON venue.venue_id = venue_visit.venue_id
WHERE venue.venue_id = p_venue_id;
$$;

CREATE OR REPLACE FUNCTION select_venues_by_user (
    p_user_id INTEGER_NOTNULL
)
RETURNS SETOF user_venue_data
LANGUAGE sql
AS
$$
SELECT
    venue.venue_id,
    venue.venue_name,
    venue.venue_address,
    venue.latitude,
    venue.longitude,
    venue_visit.visits
FROM venue
INNER JOIN (
    SELECT
        visit_view.venue_id,
        ARRAY_AGG(
            (
                visit_view.visit_id,
                visit_view.visit_date,
                visit_view.notes,
                visit_view.rating,
                visit_view.drink,
                visit_view.crawls
            )::user_venue_visit_data
        ) AS visits
    FROM visit_view
    WHERE visit_view.user_id = p_user_id
    GROUP BY visit_view.venue_id
) venue_visit
ON venue.venue_id = venue_visit.venue_id;
$$;

CREATE OR REPLACE FUNCTION select_visits ()
RETURNS SETOF user_visit_data
LANGUAGE sql
AS
$$
SELECT
    visit_view.visit_id,
    visit_view.user_id,
    visit_view.display_name,
    visit_view.venue_id,
    visit_view.venue_name,
    visit_view.visit_date,
    visit_view.notes,
    visit_view.rating,
    visit_view.drink,
    visit_view.crawls
FROM visit_view;
$$;

CREATE OR REPLACE FUNCTION select_visits_by_crawl_id (
    p_crawl_id INTEGER_NOTNULL
)
RETURNS SETOF crawl_visit_data
LANGUAGE sql
AS
$$
SELECT
    visit_view.visit_id,
    visit_view.user_id,
    visit_view.display_name,
    visit_view.venue_id,
    visit_view.venue_name,
    visit_view.visit_date,
    visit_view.notes,
    visit_view.rating,
    visit_view.drink
FROM visit_view
INNER JOIN crawl_visit
ON visit_view.visit_id = crawl_visit.visit_id
WHERE crawl_visit.crawl_id = p_crawl_id;
$$;

CREATE OR REPLACE FUNCTION select_visit (
    p_visit_id INTEGER_NOTNULL
)
RETURNS SETOF visit_data
LANGUAGE sql
AS
$$
SELECT
    visit_view.visit_id,
    visit_view.user_id,
    visit_view.venue_id,
    visit_view.venue_name,
    visit_view.visit_date,
    visit_view.notes,
    visit_view.rating,
    visit_view.drink,
    visit_view.crawls
FROM visit_view
$$;

CREATE OR REPLACE FUNCTION select_user_summary (
    p_user_id INTEGER
)
RETURNS SETOF user_summary_data
LANGUAGE sql
AS
$$
SELECT
    app_user.user_id,
    app_user.display_name,
    COALESCE(user_visit.visits, ARRAY[]::single_user_visit_data[])
FROM app_user
LEFT JOIN (
    SELECT
        visit.user_id,
        ARRAY_AGG(
            (
                visit.visit_id,
                venue.venue_id,
                venue.venue_name,
                visit.visit_date,
                visit.notes,
                visit.rating,
                visit.drink,
                visit_crawl.crawls
            )::single_user_visit_data
            ORDER BY visit.visit_date
        ) AS visits
    FROM visit
    INNER JOIN venue
    ON visit.venue_id = venue.venue_id
    INNER JOIN (
        SELECT
            crawl_visit.visit_id,
            ARRAY_AGG(
                (
                    crawl_visit.crawl_id,
                    crawl.crawl_name
                )::visit_crawl_data
                ORDER BY crawl_visit.crawl_id
            ) AS crawls
        FROM crawl_visit
        INNER JOIN crawl
        ON crawl_visit.crawl_id = crawl.crawl_id
        GROUP BY crawl_visit.visit_id
    ) visit_crawl
    ON visit.visit_id = visit_crawl.visit_id
    GROUP BY visit.user_id
) user_visit
ON app_user.user_id = user_visit.user_id
WHERE app_user.user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION select_user_counts ()
RETURNS SETOF user_count_data
LANGUAGE sql
AS
$$
SELECT
    app_user.user_id,
    app_user.display_name,
    user_crawl_agg.crawls
FROM app_user
LEFT JOIN (
    SELECT
        user_crawl.user_id,
        ARRAY_AGG(
            (
                user_crawl.crawl_id,
                user_crawl.crawl_name,
                user_crawl.visit_count,
                user_crawl.unique_visit_count,
                user_crawl.favourite_venue
            )::user_crawl_count_data
        ) AS crawls
    FROM (
        SELECT
            user_crawl_count.user_id,
            user_crawl_count.crawl_id,
            crawl.crawl_name,
            user_crawl_count.visit_count,
            user_crawl_count.unique_visit_count,
            user_crawl_favourite.venue_name AS favourite_venue
        FROM (
            SELECT
                crawl_visit.user_id,
                crawl_visit.crawl_id,
                COUNT(crawl_visit.*) AS visit_count,
                COUNT(DISTINCT crawl_visit.venue_id) AS unique_visit_count
            FROM crawl_visit
            GROUP BY crawl_visit.user_id, crawl_visit.crawl_id
        ) user_crawl_count
        INNER JOIN crawl
        ON user_crawl_count.crawl_id = crawl.crawl_id
        INNER JOIN user_crawl_favourite
        ON user_crawl_count.crawl_id = user_crawl_favourite.crawl_id
        AND user_crawl_count.user_id = user_crawl_favourite.user_id
    ) user_crawl
    GROUP BY user_crawl.user_id
) user_crawl_agg
ON app_user.user_id = user_crawl_agg.user_id
ORDER BY app_user.user_id;
$$;

CREATE OR REPLACE FUNCTION select_crawls ()
RETURNS SETOF crawl_data
LANGUAGE sql
AS
$$
SELECT
    crawl.crawl_id,
    crawl.crawl_name,
    crawl.crawl_dates,
    crawl.is_public,
    crawl.crawl_bg,
    crawl.crawl_fg,
    crawl_venue_agg.venues
FROM crawl
INNER JOIN (
    SELECT
        crawl_venue.crawl_id,
        ARRAY_AGG(
            (
                venue.venue_id,
                venue.venue_name
            )::crawl_venue_short_data
        ) AS venues
    FROM crawl_venue
    INNER JOIN venue
    ON crawl_venue.venue_id = venue.venue_id
    GROUP BY crawl_venue.crawl_id
) crawl_venue_agg
ON crawl.crawl_id = crawl_venue_agg.crawl_id;
$$;

CREATE OR REPLACE FUNCTION update_user (
    p_user_id INTEGER,
    p_email TEXT,
    p_display_name TEXT,
    p_new_hashed_password TEXT,
    p_is_active BOOLEAN,
    p_is_superuser BOOLEAN,
    p_is_verified BOOLEAN,
    p_last_verify_request TIMESTAMP WITH TIME ZONE
)
RETURNS SETOF user_data
LANGUAGE sql
AS
$$
UPDATE app_user
SET
    email = COALESCE(p_email, email),
    display_name = COALESCE(p_display_name, display_name),
    hashed_password = COALESCE(p_new_hashed_password, hashed_password),
    is_active = COALESCE(p_is_active, is_active),
    is_superuser = COALESCE(p_is_superuser, is_superuser),
    is_verified = COALESCE(p_is_verified, is_verified),
    last_verify_request = COALESCE(p_last_verify_request, last_verify_request)
WHERE user_id = p_user_id
RETURNING
    user_id,
    email,
    display_name,
    hashed_password,
    is_active,
    is_superuser,
    is_verified,
    last_verify_request
$$;

CREATE OR REPLACE FUNCTION update_user_display_name (
    p_user_id INTEGER,
    p_new_display_name TEXT
)
RETURNS VOID
LANGUAGE sql
AS
$$
UPDATE app_user
SET display_name = p_new_display_name
WHERE user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION update_user_last_verify_request (
    p_user_id INTEGER,
    p_new_last_verify_request TIMESTAMP WITH TIME ZONE
)
RETURNS VOID
LANGUAGE sql
AS
$$
UPDATE app_user
SET last_verify_request = p_new_last_verify_request
WHERE user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION delete_user (
    p_user_id INTEGER
)
RETURNS VOID
LANGUAGE sql
AS
$$
DELETE FROM app_user
WHERE user_id = p_user_id;
$$;