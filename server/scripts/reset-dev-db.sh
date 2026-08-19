#!/usr/bin/env bash
#
# Remet la base de développement dans l'état d'une installation neuve, SANS
# détruire le volume ni le schéma : vide les données, recharge les données de
# référence Dewey, puis les fixtures de développement.
#
#   server/scripts/reset-dev-db.sh
#
# Pourquoi ce script plutôt que sql/reset.sql seul — reset.sql tronque les
# tables Dewey, et Flyway ne les repeuplera JAMAIS : V2 est déjà enregistrée
# comme appliquée dans flyway_schema_history, elle n'est pas rejouée au
# démarrage. Un reset.sql nu laisse donc une base sans classification Dewey,
# dans laquelle plus aucun livre documentaire ne peut être créé. reset.sql ne
# tronque pas non plus `cover`, ce qui fait échouer un rechargement de
# covers.sql sur cover_pkey.
#
# Ce script ne touche pas à flyway_schema_history : le schéma et l'historique
# des migrations sont conservés. Pour repartir d'un volume vierge, c'est
# `docker compose down -v` qu'il faut, suivi d'un démarrage du backend puis de
# load-dev-fixtures.sh.

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_lib.sh"

usage() {
    cat <<'EOF'
Usage: reset-dev-db.sh [--database NOM] [--yes]

  --database NOM  Base cible (défaut : $POSTGRES_DB du conteneur).
  --yes, -y       Ne pas demander confirmation. À vos risques.

Vide toutes les données métier, recharge Dewey puis les fixtures de dev.
Le schéma et flyway_schema_history sont conservés.
EOF
}

parse_common_args "$@"
require_container
require_schema

confirm "Toutes les données métier vont être supprimées : livres, exemplaires,
   emprunts, réservations, usagers, couvertures. Irréversible."

info "vidage des tables métier (sql/reset.sql)"
db_run_file "$SQL_DIR/reset.sql"

# reset.sql ne liste pas `cover` ; sans ça, covers.sql échoue sur cover_pkey.
info "vidage de la table cover"
db_exec -q -c "TRUNCATE TABLE cover;"
ok "données supprimées"

info "rechargement des données de référence Dewey (V2)"
db_run_file "$MIGRATION_DIR/V2__dewey_reference_data.sql"
ok "Dewey rechargée"

info "rechargement des fixtures de développement"
ASSUME_YES=1
db_run_file "$SQL_DIR/seed.sql"
ok "seed.sql"
db_run_file "$SQL_DIR/covers.sql"
ok "covers.sql"

print_counts
