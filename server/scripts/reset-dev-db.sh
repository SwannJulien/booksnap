#!/usr/bin/env bash
#
# Returns the development database to the state of a fresh install, WITHOUT
# destroying the volume or the schema: empties the data, reloads the Dewey
# reference data, then the development fixtures.
#
#   server/scripts/reset-dev-db.sh
#
# Why this script rather than sql/reset.sql on its own — reset.sql truncates the
# Dewey tables, and Flyway will NEVER repopulate them: V2 is already recorded as
# applied in flyway_schema_history, so it is not replayed at startup. A bare
# reset.sql therefore leaves a database with no Dewey classification, in which
# no non-fiction book can be created any more. reset.sql does not truncate
# `cover` either, which makes a later covers.sql reload fail on cover_pkey.
#
# This script does not touch flyway_schema_history: the schema and the migration
# history are kept. To start over from a clean volume, use
# `docker compose down -v`, then start the backend, then load-dev-fixtures.sh.

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

usage() {
    cat <<'EOF'
Usage: reset-dev-db.sh [--database NAME] [--yes]

  --database NAME  Target database (default: the container's $POSTGRES_DB).
  --yes, -y        Do not ask for confirmation. At your own risk.

Empties all business data, reloads Dewey then the dev fixtures.
The schema and flyway_schema_history are kept.
EOF
}

parse_common_args "$@"
require_container
require_schema

confirm "All business data will be deleted: books, copies, borrowings, holds,
   users, covers. This cannot be undone."

info "emptying the business tables (sql/reset.sql)"
db_run_file "$SQL_DIR/reset.sql"

# reset.sql does not list `cover`; without this, covers.sql fails on cover_pkey.
info "emptying the cover table"
db_exec -q -c "TRUNCATE TABLE cover;"
ok "data deleted"

info "reloading the Dewey reference data (V2)"
db_run_file "$MIGRATION_DIR/V2__dewey_reference_data.sql"
ok "Dewey reloaded"

info "reloading the development fixtures"
ASSUME_YES=1
db_run_file "$SQL_DIR/seed.sql"
ok "seed.sql"
db_run_file "$SQL_DIR/covers.sql"
ok "covers.sql"

print_counts
