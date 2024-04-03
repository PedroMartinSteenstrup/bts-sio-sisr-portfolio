-- autocommit is deactivated
BEGIN TRANSACTION;
SET search_path TO public;

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    set_name TEXT NOT NULL,
    set_value TEXT NOT NULL
);

DROP TABLE IF EXISTS courses;
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    c_bloc TEXT NOT NULL,
    c_titre TEXT NOT NULL,
    c_description TEXT NOT NULL,
    c_année TEXT NOT NULL
);

INSERT INTO courses (c_bloc, c_titre, c_description, c_année)
VALUES (
        'Bloc 1',
        'Support et mise à disposition de services informatiques',
        'Le bloc de compétences 1 « Support et mise à disposition des services informatiques » vise à acquérir les compétences nécessaires à l''exercice d''activités de support et de mise à disposition de services informatiques pour répondre aux besoins d''une organisation cliente.',
        '2 Année'
    );
INSERT INTO courses (c_bloc, c_titre, c_description, c_année)
VALUES (
        'Bloc 2',
        'Administration des systèmes et des réseaux',
        'Le Bloc 2 de compétences professionnelles option SISR « Administration des systèmes et des réseaux » vous permettra de construire les savoirs et savoir-faire liés à la conception, à l''installation et à l''administration d''une infrastructure réseau pour répondre aux besoins d''une organisation cliente. Il vous permettra également de consolider les techniques de résolution d''incidents liés aux composants réseaux, systèmes et services et de perfectionner les techniques de rédaction d''un compte rendu, d''une documentation, d''une procédure d''installation et de configuration.',
        '2 Année'
    );

COMMIT;