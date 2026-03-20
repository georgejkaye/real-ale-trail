CREATE OR REPLACE VIEW crawl_visit
AS
SELECT
    crawl.crawl_id,
    visit.visit_id,
    visit.user_id,
    visit.venue_id,
    visit.rating,
    visit.visit_date
FROM crawl
INNER JOIN crawl_venue
ON crawl.crawl_id = crawl_venue.crawl_id
INNER JOIN visit
ON crawl_venue.venue_id = visit.venue_id
AND visit.visit_date::date <@ crawl.crawl_dates;