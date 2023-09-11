#!/bin/bash

# Path to your JSON file
JSON_FILE="./multisig.json"

# Database password
DB_PASSWORD="postgres"

# Use psql to execute an SQL command to insert the file contents
PGPASSWORD="$DB_PASSWORD" psql -U postgres -p 23798 -h localhost squid -c "INSERT INTO metadata (id, contract_address, content) VALUES ('0x1234', '0x1234', E'\\\\x$(xxd -p -c 256 "$JSON_FILE")');"
