CREATE OR REPLACE VIEW user_crawl_favourite
AS
SELECT
    user_favourite_id.user_id,
    user_favourite_id.crawl_id,
    venue.venue_name
FROM (
    SELECT
        DISTINCT ON(crawl_visit.user_id, crawl_visit.crawl_id)
        crawl_visit.user_id,
        crawl_visit.crawl_id,
        crawl_visit.venue_id
    FROM crawl_visit
    INNER JOIN (
        SELECT
            crawl_visit.user_id,
            crawl_visit.crawl_id,
            MAX(crawl_visit.rating) AS rating
        FROM crawl_visit
        GROUP BY user_id, crawl_id
    ) user_max_rating
    ON crawl_visit.user_id = user_max_rating.user_id
    AND crawl_visit.rating = user_max_rating.rating
    ORDER BY
        crawl_visit.user_id,
        crawl_visit.crawl_id,
        crawl_visit.visit_date
) user_favourite_id
INNER JOIN venue
ON user_favourite_id.venue_id = venue.venue_id;