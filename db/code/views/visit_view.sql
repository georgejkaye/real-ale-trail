CREATE OR REPLACE VIEW visit_view
AS
SELECT
    visit.visit_id,
    visit.user_id,
    app_user.display_name,
    venue.venue_id,
    venue.venue_name,
    visit.visit_date,
    visit.notes,
    visit.rating,
    visit.drink,
    visit_crawls.crawls
FROM visit
INNER JOIN app_user
ON visit.user_id = app_user.user_id
INNER JOIN venue
ON visit.venue_id = venue.venue_id
INNER JOIN (
    SELECT
        visit.visit_id,
        ARRAY_AGG(
            (
                crawl.crawl_id,
                crawl.crawl_name
            )::visit_crawl_data
        ) AS crawls
    FROM crawl
    INNER JOIN crawl_venue
    ON crawl.crawl_id = crawl_venue.crawl_id
    INNER JOIN visit
    ON visit.venue_id = crawl_venue.venue_id
    AND visit.visit_date::date <@ crawl.crawl_dates
    GROUP BY visit.visit_id
) visit_crawls
ON visit.visit_id = visit_crawls.visit_id;