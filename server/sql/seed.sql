-- Insert libraries (skip if already exists)
INSERT INTO library (name) VALUES ('Preschool'),('Primary')
ON CONFLICT (name) DO NOTHING;

-- Insert Users
-- Students belong to a house (named after famous Spanish painters), independently of their key stage.
-- Staff / super users have no house, key stage or parent email.
INSERT INTO users (first_name, last_name, is_super, email, genre, parent_email, key_stage, house) VALUES
('Alice',   'Martin',    false, 'alice.martin@example.com',    'female', 'parent.martin@example.com',   'ks_2',       'Goya'),
('Bob',     'Johnson',   false, 'bob.johnson@example.com',     'male',   'parent.johnson@example.com',  'ks_3',       'Velazquez'),
('Clara',   'Dupont',    false, 'clara.dupont@example.com',    'female', 'parent.dupont@example.com',   'ks_1',       'Picasso'),
('Daniel',  'Smith',     false, 'daniel.smith@example.com',    'male',   'parent.smith@example.com',    'ks_4',       'Dali'),
('Emma',    'Wilson',    false, 'emma.wilson@example.com',     'female', 'parent.wilson@example.com',   'pre_school', 'Goya'),
('Frank',   'Brown',     false, 'frank.brown@example.com',     'male',   'parent.brown@example.com',    'ks_2',       'Velazquez'),
('Grace',   'Taylor',    false, 'grace.taylor@example.com',    'female', 'parent.taylor@example.com',   'ks_5',       'Picasso'),
('Henry',   'Anderson',  false, 'henry.anderson@example.com',  'male',   'parent.anderson@example.com', 'ks_3',       'Dali'),
('Isla',    'Thomas',    false, 'isla.thomas@example.com',     'female', 'parent.thomas@example.com',   'ks_1',       'Goya'),
('James',   'White',     true,  'james.white@example.com',     'male',   NULL,                          NULL,         NULL)
ON CONFLICT (email) DO NOTHING;

-------------------------------------------------------------------------------------------------------
-- INSERT 10 BOOKS, MIX FICTION AND NON-FICTION, MULTIPLE COPIES BY BOOK AND MULTIPLE STATUSES BY COPY
-------------------------------------------------------------------------------------------------------

-- Insert Authors (skip if already exists)
INSERT INTO author (name) VALUES
('J.K. Rowling'),
('Neil deGrasse Tyson'),
('Roald Dahl'),
('Yuval Noah Harari'),
('Agatha Christie'),
('Walter Isaacson'),
('J.R.R. Tolkien'),
('Ian Stewart'),
('Eric Carle'),
('David Attenborough')
ON CONFLICT (name) DO NOTHING;

-- Insert Books (skip if ISBN or title already exists)
-- Note: This uses a DO NOTHING approach, so if the book exists, it won't be inserted
INSERT INTO book (isbn10, isbn13, title, publishing_year, publisher, number_of_pages, year_recommendation, is_fiction, code_dewey) VALUES
('0439708184', '9780439708180', 'Harry Potter and the Sorcerer''s Stone', 1998, 'Scholastic', 309, 'ks_3', true, NULL),
('0393609391', '9780393609394', 'Astrophysics for People in a Hurry', 2017, 'W. W. Norton & Company', 224, 'ks_4', false, '520'),
('0142410314', '9780142410318', 'Charlie and the Chocolate Factory', 1964, 'Puffin Books', 176, 'ks_3', true, NULL),
('0062316117', '9780062316110', 'Sapiens: A Brief History of Humankind', 2015, 'Harper', 443, 'ks_4', false, '900'),
('0062073486', '9780062073488', 'Murder on the Orient Express', 1934, 'William Morrow', 256, 'ks_4', true, NULL),
('1501127624', '9781501127625', 'Leonardo da Vinci', 2017, 'Simon & Schuster', 624, 'ks_4', false, '920'),
('0544003415', '9780544003415', 'The Hobbit', 1937, 'Mariner Books', 366, 'ks_3', true, NULL),
('0465054749', '9780465054749', 'Seventeen Equations that Changed the World', 2012, 'Basic Books', 352, 'ks_4', false, '510'),
('0399226907', '9780399226908', 'The Very Hungry Caterpillar', 1969, 'Philomel Books', 26,'ks_1', true, NULL),
('0062320041', '9780062320049', 'Life on Earth', 1979, 'HarperCollins', 319, 'ks_2', false, '570')
ON CONFLICT DO NOTHING;

-- Insert Genres (skip if already exists)
INSERT INTO genre (name) VALUES
('Fantasy'),
('Adventure'),
('Young Adult'),
('Science'),
('Physics'),
('Astronomy'),
('Children'),
('Mystery'),
('Crime'),
('Thriller'),
('History'),
('Anthropology'),
('Biography'),
('Art'),
('Mathematics'),
('Picture Book'),
('Nature'),
('Biology')
ON CONFLICT (name) DO NOTHING;

-- Link Authors to Books (skip if relationship already exists)
INSERT INTO book_author (author_id, book_id) VALUES
(1, 1),  -- J.K. Rowling - Harry Potter
(2, 2),  -- Neil deGrasse Tyson - Astrophysics
(3, 3),  -- Roald Dahl - Charlie and the Chocolate Factory
(4, 4),  -- Yuval Noah Harari - Sapiens
(5, 5),  -- Agatha Christie - Murder on the Orient Express
(6, 6),  -- Walter Isaacson - Leonardo da Vinci
(7, 7),  -- J.R.R. Tolkien - The Hobbit
(8, 8),  -- Ian Stewart - Seventeen Equations
(9, 9),  -- Eric Carle - The Very Hungry Caterpillar
(10, 10) -- David Attenborough - Life on Earth
ON CONFLICT (author_id, book_id) DO NOTHING;

-- Insert Copies (each book has 1-3 copies, all in library 1)
-- section_name is the shelf/section where the copy is stored
-- identification_code = first 3 letters of section + "-" + first 3 letters of author surname
INSERT INTO copy (book_id, section_name, identification_code, library_id, status) VALUES
-- Harry Potter by J.K. Rowling (1 copy - available) - Fiction section
(1, 'Fiction', 'FIC-ROW', 1, 'available'),

-- Astrophysics for People in a Hurry by Neil deGrasse Tyson (3 copies - mixed statuses) - Science section
(2, 'Science', 'SCI-TYS', 1, 'available'),
(2, 'Science', 'SCI-TYS', 1, 'available'),
(2, 'Science', 'SCI-TYS', 1, 'available'),

-- Charlie and the Chocolate Factory by Roald Dahl (2 copies - available and borrowed) - Children section
(3, 'Children', 'CHI-DAH', 1, 'available'),
(3, 'Children', 'CHI-DAH', 1, 'available'),

-- Sapiens by Yuval Noah Harari (2 copies - borrowed and on_hold) - History section
(4, 'History', 'HIS-HAR', 1, 'available'),
(4, 'History', 'HIS-HAR', 1, 'available'),

-- Murder on the Orient Express by Agatha Christie (1 copy - available) - Mystery section
(5, 'Mystery', 'MYS-CHR', 1, 'available'),

-- Leonardo da Vinci by Walter Isaacson (3 copies - all different statuses) - Biography section
(6, 'Biography', 'BIO-ISA', 1, 'available'),
(6, 'Biography', 'BIO-ISA', 1, 'available'),
(6, 'Biography', 'BIO-ISA', 1, 'available'),

-- The Hobbit by J.R.R. Tolkien (2 copies - available) - Fantasy section
(7, 'Fantasy', 'FAN-TOL', 1, 'available'),
(7, 'Fantasy', 'FAN-TOL', 1, 'available'),

-- Seventeen Equations by Ian Stewart (1 copy - borrowed) - Mathematics section
(8, 'Mathematics', 'MAT-STE', 1, 'available'),

-- The Very Hungry Caterpillar by Eric Carle (3 copies - mixed statuses) - Picture Books section
(9, 'Picture Books', 'PIC-CAR', 1, 'available'),
(9, 'Picture Books', 'PIC-CAR', 1, 'available'),
(9, 'Picture Books', 'PIC-CAR', 1, 'available'),

-- Life on Earth by David Attenborough (2 copies - available and on_hold) - Nature section
(10, 'Nature', 'NAT-ATT', 1, 'available'),
(10, 'Nature', 'NAT-ATT', 1, 'available');

-- Link Genres to Books (skip if relationship already exists)
INSERT INTO book_genre (genre_id, book_id) VALUES
-- Harry Potter and the Sorcerer's Stone: Fantasy, Adventure, Young Adult
(1, 1),   -- Fantasy
(2, 1),   -- Adventure
(3, 1),   -- Young Adult

-- Astrophysics for People in a Hurry: Science, Physics, Astronomy
(4, 2),   -- Science
(5, 2),   -- Physics
(6, 2),   -- Astronomy

-- Charlie and the Chocolate Factory: Children, Fantasy, Adventure
(7, 3),   -- Children
(1, 3),   -- Fantasy
(2, 3),   -- Adventure

-- Sapiens: A Brief History of Humankind: History, Anthropology, Science
(11, 4),  -- History
(12, 4),  -- Anthropology
(4, 4),   -- Science

-- Murder on the Orient Express: Mystery, Crime, Thriller
(8, 5),   -- Mystery
(9, 5),   -- Crime
(10, 5),  -- Thriller

-- Leonardo da Vinci: Biography, History, Art
(13, 6),  -- Biography
(11, 6),  -- History
(14, 6),  -- Art

-- The Hobbit: Fantasy, Adventure, Children
(1, 7),   -- Fantasy
(2, 7),   -- Adventure
(7, 7),   -- Children

-- Seventeen Equations that Changed the World: Mathematics, Science, History
(15, 8),  -- Mathematics
(4, 8),   -- Science
(11, 8),  -- History

-- The Very Hungry Caterpillar: Children, Picture Book
(7, 9),   -- Children
(16, 9),  -- Picture Book

-- Life on Earth: Nature, Biology, Science
(17, 10), -- Nature
(18, 10), -- Biology
(4, 10)   -- Science
ON CONFLICT (genre_id, book_id) DO NOTHING;