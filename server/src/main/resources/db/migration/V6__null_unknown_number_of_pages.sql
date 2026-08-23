-- Books created before the numberOfPages fix stored 0 where the page count was
-- unknown: CreateBookRequest declared an `int`, and Jackson turns a JSON null into
-- the primitive's 0 default. The request record is an Integer since then, so no new
-- row can pick up a 0 that way.
--
-- A zero-page book does not exist, so the conversion is unambiguous.
UPDATE book SET number_of_pages = NULL WHERE number_of_pages = 0;

-- "Unknown" is spelled NULL, and 0 is now unrepresentable. Had this constraint been
-- here, the Jackson default would have failed loudly on insert instead of quietly
-- writing a wrong page count.
ALTER TABLE book ADD CONSTRAINT book_pages_positive
    CHECK (number_of_pages IS NULL OR number_of_pages > 0);
