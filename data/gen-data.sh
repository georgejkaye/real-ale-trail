#!/bin/sh

DB_POPULATE_DIR=/db/.populate

if [ ! -d $DB_POPULATE_DIR ]
then
    mkdir $DB_POPULATE_DIR
fi

DB_SCHEMA_DIR="/db/schema"

if [ ! -d $DB_SCHEMA_DIR ]
then
    echo "Could not find db schema directory"
    exit 1
fi

for SCHEMA_FILE in `find $DB_SCHEMA_DIR -name *sql`
do
    cp $SCHEMA_FILE "$DB_POPULATE_DIR/1_schema_${SCHEMA_FILE#$DB_SCHEMA_DIR/}"
done

DB_DATA_DIR="/db/data"

if [ -d $DB_DATA_DIR ]
then
    for DATA_FILE in `find $DB_DATA_DIR -name *sql`
    do
        cp $DATA_FILE "$DB_POPULATE_DIR/2_data_${DATA_FILE#$DB_DATA_DIR/}"
    done
fi

process_db_code_file () {
    DB_CODE_DIR=$1
    CODE_FILE_PREFIX=$2

    if [ -d $DB_CODE_DIR ]
    then
        for CODE_FILE in `find $DB_CODE_DIR -name *sql`
        do
            FILE_NAME="${CODE_FILE_PREFIX}_${CODE_FILE#$DB_CODE_DIR/}"
            OUTPUT_FILE=$( echo $FILE_NAME | sed 's/\//_/g' )
            cp $CODE_FILE "$DB_POPULATE_DIR/$OUTPUT_FILE"
        done
    fi
}

process_db_code_file "/db/code/domains" 3_domains
process_db_code_file "/db/code/types" 4_types
process_db_code_file "/db/code/views" 5_views
process_db_code_file "/db/code/functions" 6_functions