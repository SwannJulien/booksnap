#!/usr/bin/env bash
# Fonctions communes aux scripts de server/scripts/.
# Pas destiné à être exécuté directement.

set -euo pipefail

CONTAINER="${BOOKSNAP_CONTAINER:-booksnap-postgres}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_DIR="$SCRIPT_DIR/../sql"
MIGRATION_DIR="$SCRIPT_DIR/../src/main/resources/db/migration"

# Base cible. Par défaut $POSTGRES_DB tel que défini dans le conteneur ; peut
# être forcée avec --database pour travailler sur une base jetable.
TARGET_DB=""
PG_USER=""

die() { printf '\033[31merreur\033[0m : %s\n' "$*" >&2; exit 1; }
info() { printf '\033[36m•\033[0m %s\n' "$*"; }
ok()   { printf '\033[32m✓\033[0m %s\n' "$*"; }

parse_common_args() {
    while [ $# -gt 0 ]; do
        case "$1" in
            --database) TARGET_DB="${2:-}"; [ -n "$TARGET_DB" ] || die "--database attend un nom"; shift 2 ;;
            --database=*) TARGET_DB="${1#*=}"; shift ;;
            --yes|-y) ASSUME_YES=1; shift ;;
            -h|--help) usage; exit 0 ;;
            *) die "argument inconnu : $1 (voir --help)" ;;
        esac
    done
}

require_container() {
    docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null | grep -q true \
        || die "le conteneur $CONTAINER ne tourne pas. Lancer : docker compose up -d db"

    # On lit les identifiants dans l'environnement du conteneur : pas besoin de
    # parser le .env depuis l'hôte, et pas de mot de passe à manipuler (psql
    # local au conteneur passe par la confiance locale).
    PG_USER="$(docker exec "$CONTAINER" printenv POSTGRES_USER)"
    [ -n "$PG_USER" ] || die "POSTGRES_USER absent de l'environnement de $CONTAINER"
    if [ -z "$TARGET_DB" ]; then
        TARGET_DB="$(docker exec "$CONTAINER" printenv POSTGRES_DB)"
        [ -n "$TARGET_DB" ] || die "POSTGRES_DB absent de l'environnement de $CONTAINER"
    fi
}

# psql sur la base cible. Les arguments sont passés directement à psql, sans
# shell intermédiaire : le SQL peut contenir parenthèses, quotes et $$ sans
# précaution particulière.
db_exec() {
    docker exec -i "$CONTAINER" psql -U "$PG_USER" -d "$TARGET_DB" -v ON_ERROR_STOP=1 "$@"
}

# Joue un fichier SQL de l'hôte sans le monter dans le conteneur.
db_run_file() {
    local file="$1"
    [ -f "$file" ] || die "fichier introuvable : $file"
    db_exec -q -f - < "$file"
}

db_scalar() { db_exec -Atc "$1"; }

require_schema() {
    local n
    n="$(db_scalar "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='book'")"
    [ "$n" = "1" ] || die "la table 'book' n'existe pas dans la base $TARGET_DB.
  Le schéma appartient à Flyway et est construit au démarrage du backend.
  Démarrer le backend depuis l'IDE, puis relancer ce script."
}

print_counts() {
    db_exec -c "SELECT
        (SELECT count(*) FROM book)            AS livres,
        (SELECT count(*) FROM copy)            AS exemplaires,
        (SELECT count(*) FROM author)          AS auteurs,
        (SELECT count(*) FROM genre)           AS genres,
        (SELECT count(*) FROM users)           AS usagers,
        (SELECT count(*) FROM cover)           AS couvertures,
        (SELECT count(*) FROM dewey_category)  AS dewey;"
}

confirm() {
    [ "${ASSUME_YES:-0}" = "1" ] && return 0
    printf '\033[33m⚠\033[0m  %s\n' "$1"
    printf '   Base : %s (conteneur %s)\n' "$TARGET_DB" "$CONTAINER"
    printf '   Taper "oui" pour continuer : '
    local answer; read -r answer
    [ "$answer" = "oui" ] || die "annulé"
}
