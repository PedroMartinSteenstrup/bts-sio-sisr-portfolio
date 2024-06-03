-- autocommit is deactivated
BEGIN TRANSACTION;
SET search_path TO public;

TRUNCATE table settings;
TRUNCATE table courses;
TRUNCATE table experiences;
TRUNCATE table realisations CASCADE;
TRUNCATE table realisations_docs;
TRUNCATE table utilisateurs;
TRUNCATE table projets CASCADE;
TRUNCATE table projets_docs;

COMMIT;