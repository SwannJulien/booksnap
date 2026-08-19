#!/usr/bin/env bash
#
# Charge les données de développement (seed.sql puis covers.sql) dans une base
# dont le schéma existe déjà.
#
# À utiliser après un `docker compose down -v` : le volume recréé donne une base
# vide, le schéma est ensuite construit par Flyway au démarrage du backend, et
# c'est seulement là que ces fixtures peuvent être chargées.
#
#   docker compose up -d db
#   # démarrer le backend depuis l'IDE  -> Flyway joue V1..Vn
#   server/scripts/load-dev-fixtures.sh
#
# Ces fichiers sont délibérément hors des migrations : ce sont des données de
# développement, elles n'ont rien à faire dans une base de production.

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

usage() {
    cat <<'EOF'
Usage: load-dev-fixtures.sh [--database NOM] [--yes]

  --database NOM  Base cible (défaut : $POSTGRES_DB du conteneur).
  --yes, -y       Ne pas demander confirmation si la base contient déjà des données.
EOF
}

parse_common_args "$@"
require_container
require_schema

dewey="$(db_scalar "SELECT count(*) FROM dewey_category")"
[ "$dewey" -gt 0 ] || die "la table dewey_category est vide dans $TARGET_DB.
  Les livres de seed.sql référencent des codes Dewey ; l'insertion échouerait.
  Flyway ne la repeuplera pas : V2 est déjà enregistrée comme appliquée.
  Utiliser reset-dev-db.sh, qui recharge Dewey avant les fixtures."

books="$(db_scalar "SELECT count(*) FROM book")"
if [ "$books" -gt 0 ]; then
    confirm "La base contient déjà $books livre(s). seed.sql va échouer sur les
   contraintes d'unicité (author_name_key, genre_name_key, cover_pkey…).
   Pour repartir propre, utiliser plutôt reset-dev-db.sh."
fi

info "chargement de seed.sql"
db_run_file "$SQL_DIR/seed.sql"
ok "seed.sql"

info "chargement de covers.sql"
db_run_file "$SQL_DIR/covers.sql"
ok "covers.sql"

print_counts
