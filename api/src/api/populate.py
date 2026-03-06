import json
import sys

from psycopg import Connection

from api.db.functions.all import insert_venues
from api.db.types.all import VenueInputData
from api.db.types.register import register_types
from api.utils import get_secret_file_contents

venue_json_path = sys.argv[1]

with open(venue_json_path, "r") as f:
    venue_json = json.load(f)

venues: list[VenueInputData] = []

conn = Connection.connect(
    host=sys.argv[2],
    dbname=sys.argv[3],
    user=sys.argv[4],
    password=get_secret_file_contents(sys.argv[5]),
)

register_types(conn)

for venue in venue_json:
    venues.append(
        VenueInputData(
            venue["name"],
            venue["address"],
            venue["latitude"],
            venue["longitude"],
        )
    )

insert_venues(conn, venues)
