CREATE TABLE IF NOT EXISTS crawl (
    crawl_id SERIAL PRIMARY KEY,
    crawl_name TEXT NOT NULL UNIQUE,
    crawl_dates DATERANGE NOT NULL,
    is_public BOOLEAN NOT NULL,
    crawl_bg TEXT,
    crawl_fg TEXT
);

INSERT INTO crawl (
    crawl_id,
    crawl_name,
    crawl_dates,
    is_public,
    crawl_bg,
    crawl_fg
)
VALUES (
    1,
    'Real Ale Trail 2026',
    '[2026-03-01,2026-05-31]',
    't',
    '#f9eed2',
    '#282e54'
);

CREATE TABLE IF NOT EXISTS crawl_special_venue_type (
    crawl_special_venue_type_id SERIAL PRIMARY KEY,
    crawl_id INTEGER NOT NULL,
    display_text TEXT NOT NULL,
    FOREIGN KEY (crawl_id) REFERENCES crawl(crawl_id),
    UNIQUE (crawl_id, display_text)
);

CREATE TABLE IF NOT EXISTS crawl_venue (
    crawl_id INTEGER NOT NULL,
    venue_id INTEGER NOT NULL,
    crawl_special_venue_type_id INTEGER,
    FOREIGN KEY (crawl_id) REFERENCES crawl(crawl_id),
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id),
    FOREIGN KEY (crawl_special_venue_type_id)
        REFERENCES crawl_special_venue_type(crawl_special_venue_type_id)
);

INSERT INTO crawl_venue (
    crawl_id,
    venue_id
)
SELECT
    1,
    venue_id
FROM venue;

CREATE TABLE IF NOT EXISTS venue_fact (
    venue_fact_id SERIAL PRIMARY KEY,
    venue_id INTEGER NOT NULL,
    fact_key TEXT NOT NULL,
    fact_value TEXT NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id)
);