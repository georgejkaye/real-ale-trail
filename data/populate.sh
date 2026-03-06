#!/bin/bash

DATA_DIR=/app/data
API_DIR=/app/api

VENUES_JSON="$DATA_DIR/venues.json"
DB_NAME=realaletrail
DB_USER=realaletrail
DB_HOST=db
DB_PASSWORD_FILE="temp.secret"

echo "realaletrail" > $DB_PASSWORD_FILE
DB_PASSWORD_FILE_PATH=`realpath $DB_PASSWORD_FILE`

pushd $API_DIR > /dev/null

poetry run python src/api/populate.py $VENUES_JSON $DB_HOST $DB_NAME $DB_USER $DB_PASSWORD_FILE_PATH

rm $DB_PASSWORD_FILE_PATH

popd > /dev/null
