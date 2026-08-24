#!/usr/bin/env bash
#
# Loads the development data (seed.sql then covers.sql) into a database whose
# schema already exists.
#
# Use after a `docker compose down -v`: the recreated volume gives an empty
# database, the schema is then built by Flyway when the backend starts, and only
# at that point can these fixtures be loaded.
#
#   docker compose up -d db
#   # start the backend from the IDE  -> Flyway applies V1..Vn
#   server/scripts/load-dev-fixtures.sh
#
# These files are deliberately kept out of the migrations: they are development
# data, and have no business in a production database.

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

usage() {
    cat <<'EOF'
Usage: load-dev-fixtures.sh [--database NAME] [--yes]

  --database NAME  Target database (default: the container's $POSTGRES_DB).
  --yes, -y        Do not ask for confirmation if the database already has data.
EOF
}

parse_common_args "$@"
require_container
require_schema

dewey="$(db_scalar "SELECT count(*) FROM dewey_category")"
[ "$dewey" -gt 0 ] || die "table dewey_category is empty in $TARGET_DB.
  The books in seed.sql reference Dewey codes; the insert would fail.
  Flyway will not repopulate it: V2 is already recorded as applied.
  Use reset-dev-db.sh, which reloads Dewey before the fixtures."

books="$(db_scalar "SELECT count(*) FROM book")"
if [ "$books" -gt 0 ]; then
    confirm "The database already holds $books book(s). seed.sql will fail on the
   unique constraints (author_name_key, genre_name_key, cover_pkey…).
   To start clean, use reset-dev-db.sh instead."
fi

info "loading seed.sql"
db_run_file "$SQL_DIR/seed.sql"
ok "seed.sql"

info "loading covers.sql"
db_run_file "$SQL_DIR/covers.sql"
ok "covers.sql"

print_counts
