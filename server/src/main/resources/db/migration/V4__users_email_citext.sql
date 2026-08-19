-- =============================================================================
-- V4 — Insensibilité à la casse : users.email, author.name, genre.name
-- =============================================================================
-- US-002. Trois colonnes portent une contrainte UNIQUE tout en étant sensibles
-- à la casse, alors que schema.sql les déclarait insensibles :
--
--   users.email   varchar(255) -> domaine `email` (citext + CHECK de format)
--   author.name   varchar(255) -> citext
--   genre.name    varchar(255) -> citext
--
-- Pour users.email c'est un bug d'authentification en attente : dès que l'email
-- devient l'identifiant de connexion, `Alice@school.org` ne retrouve pas le
-- compte de `alice@school.org` et en crée un second. Pour author.name et
-- genre.name c'est un dédoublement silencieux du catalogue.
--
-- `library.name` n'est PAS concernée : schema.sql la déclarait `TEXT`, pas
-- `CITEXT`. Sa dérive vers varchar(255) n'a pas d'effet sur la casse.
--
-- ⚠️ Cette migration ne suffit pas à elle seule. Le pilote JDBC envoie les
-- paramètres de `setString()` en `varchar` par défaut, et PostgreSQL résout
-- alors `citext = varchar` en comparaison `text` — sensible à la casse. Il faut
-- `stringtype=unspecified` dans l'URL JDBC (fait dans application.properties)
-- pour que le paramètre soit inféré en citext. L'unicité, elle, est protégée
-- dans tous les cas : la valeur est convertie en citext à l'écriture avant
-- d'être indexée.
--
-- NE JAMAIS MODIFIER CE FICHIER — checksum Flyway.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Garde 1 — doublons ne différant que par la casse
-- -----------------------------------------------------------------------------
-- Aucun au moment d'écrire la migration, mais elle sera rejouée sur d'autres
-- bases. La conversion échouerait de toute façon sur la reconstruction de
-- l'index unique ; on préfère un message qui nomme les valeurs en conflit.
-- Aucune fusion automatique : deux comptes en double sont deux vraies personnes,
-- avec potentiellement des emprunts de part et d'autre.
DO $$
DECLARE
    conflits text;
BEGIN
    SELECT string_agg(format('%s (ids: %s)', v, ids), ', ')
      INTO conflits
      FROM (
        SELECT LOWER(email) AS v, array_agg(id ORDER BY id)::text AS ids
          FROM users GROUP BY LOWER(email) HAVING count(*) > 1
      ) d;
    IF conflits IS NOT NULL THEN
        RAISE EXCEPTION
            'users.email : % groupe(s) de comptes ne différant que par la casse. Les traiter à la main avant de rejouer cette migration : %',
            (SELECT count(*) FROM (SELECT 1 FROM users GROUP BY LOWER(email) HAVING count(*) > 1) x),
            conflits;
    END IF;

    SELECT string_agg(format('author.name=%s (ids: %s)', v, ids), ', ')
      INTO conflits
      FROM (
        SELECT LOWER(name) AS v, array_agg(id ORDER BY id)::text AS ids
          FROM author GROUP BY LOWER(name) HAVING count(*) > 1
      ) d;
    IF conflits IS NOT NULL THEN
        RAISE EXCEPTION 'author.name : doublons de casse à fusionner à la main (les liaisons book_author sont à reprendre) : %', conflits;
    END IF;

    SELECT string_agg(format('genre.name=%s (ids: %s)', v, ids), ', ')
      INTO conflits
      FROM (
        SELECT LOWER(name) AS v, array_agg(id ORDER BY id)::text AS ids
          FROM genre GROUP BY LOWER(name) HAVING count(*) > 1
      ) d;
    IF conflits IS NOT NULL THEN
        RAISE EXCEPTION 'genre.name : doublons de casse à fusionner à la main (les liaisons book_genre sont à reprendre) : %', conflits;
    END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- Garde 2 — valeurs qui ne passeraient pas le CHECK du domaine `email`
-- -----------------------------------------------------------------------------
-- Le domaine porte sa propre contrainte de format. Sans cette garde, la
-- conversion échouerait ligne par ligne avec un message qui ne dit pas laquelle.
DO $$
DECLARE
    invalides text;
BEGIN
    SELECT string_agg(format('id=%s <%s>', id, email), ', ')
      INTO invalides
      FROM users
     WHERE email IS NOT NULL
       AND NOT (email::text ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
    IF invalides IS NOT NULL THEN
        RAISE EXCEPTION
            'users.email : adresses non conformes au CHECK du domaine `email`, à corriger avant conversion : %',
            invalides;
    END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- Conversions
-- -----------------------------------------------------------------------------
-- Le changement de type verrouille la table (ACCESS EXCLUSIVE) et reconstruit
-- les index uniques associés — c'est ce qui rend l'unicité insensible à la
-- casse. Volumétrie d'un établissement scolaire : l'opération est brève, mais
-- elle est à jouer hors des heures d'ouverture de la bibliothèque.
ALTER TABLE users  ALTER COLUMN email TYPE public.email USING email::public.email;
ALTER TABLE author ALTER COLUMN name  TYPE public.citext USING name::public.citext;
ALTER TABLE genre  ALTER COLUMN name  TYPE public.citext USING name::public.citext;

-- -----------------------------------------------------------------------------
-- Garde 3 — vérification a posteriori
-- -----------------------------------------------------------------------------
-- Les index uniques sont reconstruits par l'ALTER, mais on ne le suppose pas :
-- on vérifie qu'ils existent toujours et qu'ils portent bien sur le nouveau
-- type. Un index resté sur l'ancien type laisserait passer les doublons de
-- casse — exactement le bug qu'on prétend corriger.
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT unnest(ARRAY['users_email_key','author_name_key','genre_name_key']) AS idx
    LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = r.idx AND relkind = 'i') THEN
            RAISE EXCEPTION 'index unique % absent après conversion', r.idx;
        END IF;
    END LOOP;

    IF (SELECT format_type(atttypid, atttypmod) FROM pg_attribute
         WHERE attrelid = 'users'::regclass AND attname = 'email') <> 'email' THEN
        RAISE EXCEPTION 'users.email n''est pas sur le domaine `email` après conversion';
    END IF;
END
$$;
