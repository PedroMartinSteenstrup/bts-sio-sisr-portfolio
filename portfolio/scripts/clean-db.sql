-- autocommit is deactivated
BEGIN TRANSACTION;
SET search_path TO public;

TRUNCATE table settings;

TRUNCATE table courses;

COMMIT;