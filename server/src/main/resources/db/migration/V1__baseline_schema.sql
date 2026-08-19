-- =============================================================================
-- V1 — Baseline du schéma
-- =============================================================================
-- Généré depuis la base EN SERVICE (et non depuis server/sql/schema.sql, dont
-- elle avait déjà dérivé) :
--
--   docker exec booksnap-postgres sh -c \
--     'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
--        --schema-only --no-owner --no-privileges'
--
-- Ce fichier n'est PAS rejoué sur la base existante : `baseline-on-migrate`
-- avec `baseline-version=0` la marque comme déjà au niveau 1. Il ne s'exécute
-- que sur une base vierge (volume `booksnap-db-data` recréé).
--
-- NE JAMAIS MODIFIER CE FICHIER — Flyway en vérifie le checksum. Toute
-- correction est une nouvelle migration V<n>.
--
-- Il reproduit fidèlement l'état réel, dérive comprise. Les écarts connus sont
-- corrigés par des migrations ultérieures, pas ici :
--   * `users.email` est `varchar(255)` là où l'intention était le domaine
--     `email` (citext) — voir US-002.
--   * les types `keystage` et `status`, et les 4 casts associés, ne sont
--     utilisés par aucune colonne — voir V3.
--   * `author.name`, `genre.name`, `library.name` sont `varchar(255)` là où
--     `schema.sql` déclarait CITEXT — décision à prendre en US-002.
-- =============================================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: borrowing_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.borrowing_status AS ENUM (
    'borrowed',
    'returned',
    'overdue'
);


--
-- Name: copy_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.copy_status AS ENUM (
    'available',
    'borrowed',
    'on_hold',
    'lost',
    'damaged',
    'removed'
);


--
-- Name: email; Type: DOMAIN; Schema: public; Owner: -
--

CREATE DOMAIN public.email AS public.citext
	CONSTRAINT email_check CHECK ((VALUE OPERATOR(public.~) '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'::public.citext));


--
-- Name: hold_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hold_status AS ENUM (
    'pending',
    'active',
    'expired',
    'fulfilled'
);


--
-- Name: key_stage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.key_stage AS ENUM (
    'pre_school',
    'ks_1',
    'ks_2',
    'ks_3',
    'ks_4',
    'ks_5'
);


--
-- Name: keystage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.keystage AS ENUM (
    'ks_1',
    'ks_2',
    'ks_3',
    'ks_4',
    'ks_5',
    'pre_school'
);


--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_type AS ENUM (
    'overdue_reminder',
    'overdue_follow_up',
    'hold_ready',
    'hold_follow_up',
    'hold_expired'
);


--
-- Name: status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status AS ENUM (
    'active',
    'expired',
    'fulfilled',
    'pending'
);


--
-- Name: CAST (public.keystage AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.keystage AS character varying) WITH INOUT AS IMPLICIT;


--
-- Name: CAST (public.status AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.status AS character varying) WITH INOUT AS IMPLICIT;


--
-- Name: CAST (character varying AS public.keystage); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.keystage) WITH INOUT AS IMPLICIT;


--
-- Name: CAST (character varying AS public.status); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.status) WITH INOUT AS IMPLICIT;


--
-- Name: fn_capture_copy_status_on_borrowing_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_capture_copy_status_on_borrowing_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    SELECT status INTO NEW.pre_borrow_copy_status FROM copy WHERE id = NEW.copy_id;
    RETURN NEW;
END;
$$;


--
-- Name: fn_sync_copy_on_borrowing_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_copy_on_borrowing_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE copy SET status = 'borrowed' WHERE id = NEW.copy_id;
    RETURN NEW;
END;
$$;


--
-- Name: fn_sync_copy_on_borrowing_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_copy_on_borrowing_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.status = 'returned' AND OLD.status != 'returned' THEN
        IF NEW.pre_borrow_copy_status = 'damaged' THEN
            UPDATE copy SET status = 'damaged' WHERE id = NEW.copy_id;
        ELSIF EXISTS (SELECT 1 FROM hold WHERE copy_id = NEW.copy_id AND status = 'active') THEN
            UPDATE copy SET status = 'on_hold' WHERE id = NEW.copy_id;
        ELSE
            UPDATE copy SET status = 'available' WHERE id = NEW.copy_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_sync_copy_on_hold_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_copy_on_hold_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.copy_id IS NULL THEN
        RETURN NEW;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM borrowing
        WHERE copy_id = NEW.copy_id AND status IN ('borrowed', 'overdue')
    ) THEN
        UPDATE copy SET status = 'on_hold' WHERE id = NEW.copy_id;
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_sync_copy_on_hold_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_copy_on_hold_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.status = 'pending' AND NEW.status = 'active' AND NEW.copy_id IS NOT NULL THEN
        UPDATE copy SET status = 'on_hold' WHERE id = NEW.copy_id;
    ELSIF NEW.status IN ('expired', 'fulfilled') AND OLD.status = 'active' THEN
        IF NOT EXISTS (
            SELECT 1 FROM borrowing
            WHERE copy_id = NEW.copy_id AND status IN ('borrowed', 'overdue')
        ) THEN
            UPDATE copy SET status = 'available' WHERE id = NEW.copy_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: author; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.author (
    id bigint NOT NULL,
    name character varying(255),
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: author_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.author ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.author_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book (
    id bigint NOT NULL,
    isbn10 character varying(10),
    isbn13 character varying(13),
    title text NOT NULL,
    publishing_year smallint,
    publisher text,
    number_of_pages smallint,
    year_recommendation public.key_stage,
    is_fiction boolean NOT NULL,
    code_dewey character varying(255),
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT non_fiction_requires_dewey CHECK (((is_fiction = false) OR (code_dewey IS NULL)))
);


--
-- Name: book_author; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_author (
    author_id bigint NOT NULL,
    book_id bigint NOT NULL
);


--
-- Name: book_genre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.book_genre (
    genre_id bigint NOT NULL,
    book_id bigint NOT NULL
);


--
-- Name: book_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.book ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.book_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: borrowing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.borrowing (
    id bigint NOT NULL,
    copy_id bigint NOT NULL,
    user_id bigint NOT NULL,
    status public.borrowing_status DEFAULT 'borrowed'::public.borrowing_status NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    pre_borrow_copy_status public.copy_status,
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT borrowing_check CHECK ((start_date <= end_date))
);


--
-- Name: borrowing_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.borrowing ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.borrowing_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: copy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.copy (
    id bigint NOT NULL,
    book_id bigint NOT NULL,
    section_name character varying(255) NOT NULL,
    identification_code character varying(255) NOT NULL,
    library_id bigint NOT NULL,
    status public.copy_status DEFAULT 'available'::public.copy_status NOT NULL,
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: copy_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.copy ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.copy_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cover; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cover (
    isbn character varying(13) NOT NULL,
    image bytea NOT NULL,
    content_type text NOT NULL,
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: dewey_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dewey_category (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    division_code character varying(255) NOT NULL
);


--
-- Name: dewey_class; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dewey_class (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: dewey_division; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dewey_division (
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    class_code character varying(255) NOT NULL
);


--
-- Name: genre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.genre (
    id bigint NOT NULL,
    name character varying(255),
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: genre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.genre ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.genre_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: hold; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hold (
    id bigint NOT NULL,
    book_id bigint NOT NULL,
    library_id bigint NOT NULL,
    copy_id bigint,
    user_id bigint NOT NULL,
    status public.hold_status DEFAULT 'pending'::public.hold_status NOT NULL,
    start_date date,
    end_date date,
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT hold_check CHECK (((start_date IS NULL) OR (end_date IS NULL) OR (start_date <= end_date)))
);


--
-- Name: hold_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.hold ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hold_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.library (
    id bigint NOT NULL,
    name character varying(255),
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.library ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.library_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    hold_id bigint,
    borrowing_id bigint,
    sent_at date,
    type public.notification_type NOT NULL
);


--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.notification ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    is_super boolean,
    email character varying(255) NOT NULL,
    genre text,
    parent_email public.email,
    key_stage public.key_stage,
    house text,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_by character varying(255),
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by character varying(255),
    last_modified_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: author author_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_name_key UNIQUE (name);


--
-- Name: author author_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT author_pkey PRIMARY KEY (id);


--
-- Name: book_author book_author_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_author
    ADD CONSTRAINT book_author_pkey PRIMARY KEY (author_id, book_id);


--
-- Name: book_genre book_genre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_pkey PRIMARY KEY (genre_id, book_id);


--
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (id);


--
-- Name: borrowing borrowing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowing
    ADD CONSTRAINT borrowing_pkey PRIMARY KEY (id);


--
-- Name: copy copy_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.copy
    ADD CONSTRAINT copy_pkey PRIMARY KEY (id);


--
-- Name: cover cover_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cover
    ADD CONSTRAINT cover_pkey PRIMARY KEY (isbn);


--
-- Name: dewey_category dewey_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dewey_category
    ADD CONSTRAINT dewey_category_pkey PRIMARY KEY (code);


--
-- Name: dewey_class dewey_class_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dewey_class
    ADD CONSTRAINT dewey_class_pkey PRIMARY KEY (code);


--
-- Name: dewey_division dewey_division_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dewey_division
    ADD CONSTRAINT dewey_division_pkey PRIMARY KEY (code);


--
-- Name: genre genre_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_name_key UNIQUE (name);


--
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (id);


--
-- Name: hold hold_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hold
    ADD CONSTRAINT hold_pkey PRIMARY KEY (id);


--
-- Name: library library_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library
    ADD CONSTRAINT library_name_key UNIQUE (name);


--
-- Name: library library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.library
    ADD CONSTRAINT library_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_author_name_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_author_name_trgm ON public.author USING gin (name public.gin_trgm_ops);


--
-- Name: idx_book_isbn10; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_isbn10 ON public.book USING btree (isbn10 varchar_pattern_ops);


--
-- Name: idx_book_isbn13; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_isbn13 ON public.book USING btree (isbn13 varchar_pattern_ops);


--
-- Name: idx_book_title_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_book_title_trgm ON public.book USING gin (lower(title) public.gin_trgm_ops);


--
-- Name: idx_copy_book_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_copy_book_status ON public.copy USING btree (book_id, status);


--
-- Name: idx_genre_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_genre_name ON public.genre USING btree (name);


--
-- Name: idx_hold_pending_queue; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hold_pending_queue ON public.hold USING btree (book_id, created_date) WHERE (status = 'pending'::public.hold_status);


--
-- Name: uq_borrowing_one_active_per_copy; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_borrowing_one_active_per_copy ON public.borrowing USING btree (copy_id) WHERE (status = ANY (ARRAY['borrowed'::public.borrowing_status, 'overdue'::public.borrowing_status]));


--
-- Name: uq_hold_one_active_per_user_book; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_hold_one_active_per_user_book ON public.hold USING btree (user_id, book_id) WHERE (status = ANY (ARRAY['pending'::public.hold_status, 'active'::public.hold_status]));


--
-- Name: borrowing trg_borrowing_before_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_borrowing_before_insert BEFORE INSERT ON public.borrowing FOR EACH ROW EXECUTE FUNCTION public.fn_capture_copy_status_on_borrowing_insert();


--
-- Name: borrowing trg_borrowing_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_borrowing_insert AFTER INSERT ON public.borrowing FOR EACH ROW EXECUTE FUNCTION public.fn_sync_copy_on_borrowing_insert();


--
-- Name: borrowing trg_borrowing_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_borrowing_update AFTER UPDATE ON public.borrowing FOR EACH ROW EXECUTE FUNCTION public.fn_sync_copy_on_borrowing_update();


--
-- Name: hold trg_hold_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hold_insert AFTER INSERT ON public.hold FOR EACH ROW EXECUTE FUNCTION public.fn_sync_copy_on_hold_insert();


--
-- Name: hold trg_hold_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hold_update AFTER UPDATE ON public.hold FOR EACH ROW EXECUTE FUNCTION public.fn_sync_copy_on_hold_update();


--
-- Name: book_author book_author_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_author
    ADD CONSTRAINT book_author_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.author(id) ON DELETE CASCADE;


--
-- Name: book_author book_author_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_author
    ADD CONSTRAINT book_author_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(id) ON DELETE CASCADE;


--
-- Name: book book_code_dewey_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_code_dewey_fkey FOREIGN KEY (code_dewey) REFERENCES public.dewey_category(code);


--
-- Name: book_genre book_genre_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(id) ON DELETE CASCADE;


--
-- Name: book_genre book_genre_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.book_genre
    ADD CONSTRAINT book_genre_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genre(id) ON DELETE CASCADE;


--
-- Name: borrowing borrowing_copy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowing
    ADD CONSTRAINT borrowing_copy_id_fkey FOREIGN KEY (copy_id) REFERENCES public.copy(id);


--
-- Name: borrowing borrowing_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowing
    ADD CONSTRAINT borrowing_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: copy copy_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.copy
    ADD CONSTRAINT copy_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(id) ON DELETE CASCADE;


--
-- Name: copy copy_library_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.copy
    ADD CONSTRAINT copy_library_id_fkey FOREIGN KEY (library_id) REFERENCES public.library(id);


--
-- Name: dewey_category fk_category_division; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dewey_category
    ADD CONSTRAINT fk_category_division FOREIGN KEY (division_code) REFERENCES public.dewey_division(code);


--
-- Name: dewey_division fk_division_class; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dewey_division
    ADD CONSTRAINT fk_division_class FOREIGN KEY (class_code) REFERENCES public.dewey_class(code);


--
-- Name: hold hold_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hold
    ADD CONSTRAINT hold_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(id);


--
-- Name: hold hold_copy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hold
    ADD CONSTRAINT hold_copy_id_fkey FOREIGN KEY (copy_id) REFERENCES public.copy(id);


--
-- Name: hold hold_library_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hold
    ADD CONSTRAINT hold_library_id_fkey FOREIGN KEY (library_id) REFERENCES public.library(id);


--
-- Name: hold hold_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hold
    ADD CONSTRAINT hold_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notification notification_borrowing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_borrowing_id_fkey FOREIGN KEY (borrowing_id) REFERENCES public.borrowing(id);


--
-- Name: notification notification_hold_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_hold_id_fkey FOREIGN KEY (hold_id) REFERENCES public.hold(id);


--
-- Name: notification notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

