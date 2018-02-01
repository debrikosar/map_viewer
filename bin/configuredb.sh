#!/bin/bash

export PGPASSWORD='node_password'

database="mapviewer"

echo "Configuring database: $database"

dropdb -U node_user mapviewer
createdb -U node_user mapviewer

psql -U node_user mapviewer < ./bin/sql/points.sql

echo "Configured: $database"