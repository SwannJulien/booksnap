CREATE EXTENSION citext;

-- Enable trigram extension for efficient pattern matching (predictive search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE dewey_class (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE dewey_division (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    class_code TEXT NOT NULL,
    CONSTRAINT fk_division_class FOREIGN KEY (class_code) REFERENCES dewey_class(code)
);

CREATE TABLE dewey_category (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    division_code TEXT NOT NULL,
    CONSTRAINT fk_category_division FOREIGN KEY (division_code) REFERENCES dewey_division(code)
);

CREATE TYPE key_stage AS ENUM ('pre_school', 'ks_1', 'ks_2', 'ks_3', 'ks_4', 'ks_5');

CREATE TABLE book (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	isbn10 VARCHAR(10),
	isbn13 VARCHAR(13),
	title TEXT NOT NULL,
	publishing_year SMALLINT,
	publisher TEXT,
	number_of_pages SMALLINT,
	year_recommendation key_stage,
	is_fiction BOOLEAN NOT NULL,
	code_dewey TEXT REFERENCES dewey_category(code),
	created_by TEXT,
	created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT non_fiction_requires_dewey
    CHECK (is_fiction = false OR code_dewey IS NULL)
);

CREATE TABLE genre (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name CITEXT UNIQUE,
	created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE book_genre (
	genre_id BIGINT NOT NULL REFERENCES genre(id) ON DELETE CASCADE,
	book_id BIGINT NOT NULL REFERENCES book(id) ON DELETE CASCADE,

	PRIMARY KEY (genre_id, book_id)
);

CREATE TABLE author (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name CITEXT UNIQUE,
	created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE book_author (
	author_id BIGINT NOT NULL REFERENCES author(id) ON DELETE CASCADE,
	book_id BIGINT NOT NULL REFERENCES book(id) ON DELETE CASCADE,

	PRIMARY KEY (author_id, book_id)
);

CREATE TABLE library (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name TEXT UNIQUE,
	created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE copy_status AS ENUM ('available', 'borrowed', 'on_hold', 'lost', 'damaged', 'removed');

CREATE TABLE copy (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	book_id BIGINT NOT NULL REFERENCES book(id) ON DELETE CASCADE,
	section_name TEXT NOT NULL,
	identification_code TEXT NOT NULL,
	library_id BIGINT NOT NULL REFERENCES library(id),
	status copy_status NOT NULL DEFAULT 'available',
	created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE DOMAIN email AS citext
  CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

CREATE TABLE users(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	first_name TEXT,
	last_name TEXT,
	is_super BOOLEAN,
	email email UNIQUE NOT NULL,
	is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
	created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE borrowing_status AS ENUM ('borrowed', 'returned', 'overdue');

CREATE TABLE borrowing (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	copy_id BIGINT NOT NULL REFERENCES copy(id),
	user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	status borrowing_status NOT NULL DEFAULT 'borrowed',
	start_date DATE NOT NULL CHECK (start_date <= end_date),
	end_date DATE NOT NULL,
	created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE hold_status AS ENUM ('pending', 'active', 'expired', 'fulfilled');

CREATE TABLE hold (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	book_id BIGINT NOT NULL REFERENCES book(id),
	library_id BIGINT NOT NULL REFERENCES library(id),
	copy_id BIGINT REFERENCES copy(id),
	user_id BIGINT NOT NULL REFERENCES users(id),
	status hold_status NOT NULL DEFAULT 'pending',
	start_date DATE,
	end_date DATE,
	created_by TEXT,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    last_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);

CREATE TYPE notification_type AS ENUM ('overdue_reminder', 'overdue_follow_up', 'hold_ready', 'hold_follow_up');

CREATE TABLE notification (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users(id),
	hold_id BIGINT REFERENCES hold(id),
	borrowing_id BIGINT REFERENCES borrowing(id),
	sent_at DATE,
	type notification_type NOT NULL
);

-- ============================================================
-- Triggers to keep copy.status in sync with borrowing and hold
-- ============================================================

-- 1. When a borrowing is created, mark the copy as borrowed
CREATE OR REPLACE FUNCTION fn_sync_copy_on_borrowing_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE copy SET status = 'borrowed' WHERE id = NEW.copy_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_borrowing_insert
AFTER INSERT ON borrowing
FOR EACH ROW
EXECUTE FUNCTION fn_sync_copy_on_borrowing_insert();

-- 2. When a borrowing is returned, mark the copy as available
--    unless an active hold exists, in which case mark it as on_hold
CREATE OR REPLACE FUNCTION fn_sync_copy_on_borrowing_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'returned' AND OLD.status != 'returned' THEN
        IF EXISTS (SELECT 1 FROM hold WHERE copy_id = NEW.copy_id AND status = 'active') THEN
            UPDATE copy SET status = 'on_hold' WHERE id = NEW.copy_id;
        ELSE
            UPDATE copy SET status = 'available' WHERE id = NEW.copy_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_borrowing_update
AFTER UPDATE ON borrowing
FOR EACH ROW
EXECUTE FUNCTION fn_sync_copy_on_borrowing_update();

-- 3. When an active hold is created with a copy already assigned, mark it as on_hold.
--    Pending holds have no copy yet so nothing to update.
CREATE OR REPLACE FUNCTION fn_sync_copy_on_hold_insert()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hold_insert
AFTER INSERT ON hold
FOR EACH ROW
EXECUTE FUNCTION fn_sync_copy_on_hold_insert();

-- 4. When a hold status changes:
--    pending → active: a copy has been assigned, mark it as on_hold
--    active → expired/fulfilled: release the copy back to available
CREATE OR REPLACE FUNCTION fn_sync_copy_on_hold_update()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hold_update
AFTER UPDATE ON hold
FOR EACH ROW
EXECUTE FUNCTION fn_sync_copy_on_hold_update();

-- Indexes for predictive book search
CREATE INDEX idx_book_title_trgm ON book USING GIN (LOWER(title) gin_trgm_ops);
CREATE INDEX idx_author_name_trgm ON author USING GIN (name gin_trgm_ops);
CREATE INDEX idx_book_isbn10 ON book (isbn10 varchar_pattern_ops);
CREATE INDEX idx_book_isbn13 ON book (isbn13 varchar_pattern_ops);

-- Indexes for multi-filter search
CREATE INDEX IF NOT EXISTS idx_genre_name ON genre (name);
CREATE INDEX IF NOT EXISTS idx_copy_book_status ON copy (book_id, status);