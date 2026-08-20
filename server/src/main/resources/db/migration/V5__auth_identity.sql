-- =============================================================================
-- V5 — Table auth_identity : le moyen d'authentification devient une donnée
-- =============================================================================
-- US-003. Le compte et la preuve sont séparés : la ligne `users` EST l'identité,
-- `auth_identity` porte les moyens de s'y connecter. Un usager peut donc avoir
-- un mot de passe, un compte Microsoft, les deux (le temps d'une bascule), ou
-- aucun — un élève de maternelle dont le compte n'existe que pour porter ses
-- emprunts au comptoir.
--
-- L'alternative — des colonnes `password_hash` et `microsoft_sub` sur `users` —
-- créerait deux chemins de code en aval : deux façons de retrouver un compte,
-- deux endroits où penser à `is_active`. Ici, tout ce qui suit l'authentification
-- (rôle, portée, emprunts, audit) ignore par quel moyen l'usager s'est connecté.
--
-- Voir règles accès §5.1 et décision D2.
--
-- -----------------------------------------------------------------------------
-- Les trois contraintes, dans trois directions
-- -----------------------------------------------------------------------------
--   ck_auth_identity_shape          À L'INTÉRIEUR d'une ligne. `local` porte un
--     hash et aucun subject ; un fournisseur OIDC porte un subject et aucun
--     hash. Le cas interdit qui motive ce CHECK est la ligne `local` sans hash :
--     un compte qui semble protégé alors qu'il ne l'est pas.
--
--   uq_auth_identity_user_provider  DEPUIS LE COMPTE. Au plus une identité par
--     fournisseur — pas de second mot de passe. Le cumul local + microsoft
--     reste possible, c'est la fenêtre de bascule vers le SSO.
--
--   uq_auth_identity_subject        DEPUIS L'EXTÉRIEUR. Un sujet OIDC ne donne
--     accès qu'à un seul compte. Sans elle, rattacher le `sub` d'Alice au compte
--     de Bob suffit à faire de Bob un usurpateur légitime.
--
-- ⚠️ `subject` est NULL sur les lignes `local`, et deux NULL ne sont jamais
-- égaux en PostgreSQL : uq_auth_identity_subject n'y bloque donc RIEN. C'est
-- uq_auth_identity_user_provider qui empêche le doublon dans ce cas. Même piège
-- que pour app_setting (règles paramètres §1).
--
-- -----------------------------------------------------------------------------
-- Choix explicites
-- -----------------------------------------------------------------------------
-- * PAS de ON DELETE CASCADE sur user_id. Un utilisateur n'est jamais supprimé,
--   seulement désactivé (règles structurelles §3) ; une cascade suggérerait le
--   contraire. Le blocage par clé étrangère est la protection voulue.
--
-- * `subject` stocke le claim `sub` du jeton OIDC, jamais l'email : les adresses
--   changent (renommage) et sont réattribuées d'un élève à l'autre, alors que
--   `sub` est immuable et jamais réutilisé.
--
-- * `google` figure dans l'énumération sans qu'aucun code ne le traite : ajouter
--   une valeur à un type ENUM après coup est pénible, l'inscrire maintenant ne
--   coûte rien. Ce n'est pas un engagement à l'implémenter.
--
-- Aucun endpoint n'expose cette table à ce stade.
--
-- NE JAMAIS MODIFIER CE FICHIER — checksum Flyway. Toute correction est une
-- nouvelle migration V<n>.
-- =============================================================================

CREATE TYPE auth_provider AS ENUM ('local', 'microsoft', 'google');

CREATE TABLE auth_identity (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   user_id BIGINT NOT NULL REFERENCES users(id),
   provider auth_provider NOT NULL,
   subject TEXT,
   password_hash TEXT,
   created_by TEXT,
   created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   last_modified_by TEXT,
   last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT uq_auth_identity_subject UNIQUE (provider, subject),
   CONSTRAINT uq_auth_identity_user_provider UNIQUE (user_id, provider),
   CONSTRAINT ck_auth_identity_shape CHECK (
       (provider = 'local'  AND password_hash IS NOT NULL AND subject IS NULL)
           OR (provider <> 'local' AND subject IS NOT NULL AND password_hash IS NULL)
   )
);
