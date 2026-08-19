-- =============================================================================
-- V3 — Suppression des types énumérés orphelins et de leurs casts
-- =============================================================================
-- Dérive relevée lors de la mise en place de Flyway (US-001).
--
-- La base en service porte deux types énumérés absents de server/sql/schema.sql
-- et qui doublonnent des types existants :
--
--   * `keystage`  (ks_1..ks_5, pre_school)          doublon de `key_stage`
--   * `status`    (active, expired, fulfilled, pending)  doublon de `hold_status`
--
-- Aucune colonne, aucune fonction, aucun index ne les utilise — vérifié via
-- pg_attribute et pg_depend : leurs seuls dépendants sont leur type tableau
-- implicite et les quatre casts ci-dessous, eux aussi absents de schema.sql.
--
-- Les colonnes réellement en service utilisent les bons types :
--   book.year_recommendation -> key_stage
--   users.key_stage          -> key_stage
--   hold.status              -> hold_status
--
-- Les casts implicites vers/depuis `character varying` sont la signature d'un
-- contournement de mapping d'énumération Hibernate. Rien ne s'en sert
-- aujourd'hui, et un cast implicite non intentionnel entre varchar et un enum
-- est le genre de chose qui masque une erreur de type au lieu de la signaler.
--
-- Cette migration s'applique aussi bien à la base en service qu'à une base
-- vierge : sur cette dernière, elle défait ce que V1 a fidèlement reproduit.
-- =============================================================================

DROP CAST IF EXISTS (character varying AS public.keystage);
DROP CAST IF EXISTS (public.keystage AS character varying);
DROP CAST IF EXISTS (character varying AS public.status);
DROP CAST IF EXISTS (public.status AS character varying);

-- Sans CASCADE : si une dépendance est apparue entre-temps, la migration doit
-- échouer bruyamment plutôt que supprimer silencieusement ce qui en dépend.
DROP TYPE IF EXISTS public.keystage;
DROP TYPE IF EXISTS public.status;
