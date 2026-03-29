import json
import sys
from datetime import datetime

from psycopg import Connection

from api.db.functions.all import insert_crawl_fetchone, insert_venues
from api.db.types.all import VenueInputData
from api.db.types.register import register_types
from api.utils import get_secret_file_contents

data_path = sys.argv[1]

with open(data_path, "r") as f:
    data = json.load(f)


conn = Connection.connect(
    host=sys.argv[2],
    dbname=sys.argv[3],
    user=sys.argv[4],
    password=get_secret_file_contents(sys.argv[5]),
)

register_types(conn)

crawl_json = data["crawls"]
venue_json = data["venues"]

venues: list[VenueInputData] = []
crawl_lookup: dict[str, int] = {}

for crawl in crawl_json:
    result = insert_crawl_fetchone(
        conn,
        crawl["name"],
        datetime.strptime(crawl["start"], "%Y-%m-%d"),
        datetime.strptime(crawl["end"], "%Y-%m-%d"),
        True,
        crawl["bg"],
        crawl["fg"],
    )
    if result is not None:
        crawl_lookup[crawl["key"]] = result.crawl_id


for venue in venue_json:
    venues.append(
        VenueInputData(
            venue["name"],
            venue["address"],
            venue["latitude"],
            venue["longitude"],
            [crawl_lookup[key] for key in venue["crawls"]],
        )
    )

insert_venues(conn, venues)
