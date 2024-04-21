-- autocommit is deactivated
BEGIN TRANSACTION;
SET datestyle to SQL,
    DMY;
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
DROP TABLE IF EXISTS experiences;
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    c_année_début TEXT NOT NULL,
    c_année_fin TEXT NOT NULL,
    c_employeur TEXT NOT NULL,
    c_titre TEXT NOT NULL,
    c_description TEXT NOT NULL
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
INSERT INTO experiences (
        c_année_début,
        c_année_fin,
        c_employeur,
        c_titre,
        c_description
    )
VALUES (
        '2022',
        'présent',
        'HomeToGo',
        'Senior Data Platform Engineer',
        'Je développe et maintiens des applications métiers pour l''équipe Données et l''entreprise en général'
    ),
    (
        '2017',
        '2020',
        'Wise',
        'Data Analyst',
        'Mise en place d''indicateurs de performance, de solutions de visualisation et de scripts d''extraction de données'
    );
DROP TABLE IF EXISTS realisations;
CREATE TABLE IF NOT EXISTS realisations (
    id SERIAL PRIMARY KEY,
    r_début DATE NOT NULL,
    r_fin DATE NOT NULL,
    r_intitule TEXT NOT NULL,
    r_description TEXT NOT NULL,
    est_gestion_patrimoine BOOLEAN,
    est_response_incidents BOOLEAN,
    est_presence_en_ligne BOOLEAN,
    est_travail_mode_projet BOOLEAN,
    est_deploiement_service BOOLEAN,
    est_developpement_pro BOOLEAN
);
INSERT INTO realisations (
        r_début,
        r_fin,
        r_intitule,
        r_description,
        est_gestion_patrimoine,
        est_response_incidents,
        est_presence_en_ligne,
        est_travail_mode_projet,
        est_deploiement_service,
        est_developpement_pro
    )
VALUES (
        '05-03-2024',
        '30-04-2024',
        'Création d''un site portfolio dans le cadre de l''épreuve E4',
        'Express, nodejs, postgres, template, conteneurisé',
        FALSE,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        TRUE
    ),
    (
        '05-03-2024',
        '30-04-2024',
        'Automatisation de la gestion du code, des resources (utilisation du paradigme dit IaC – Infrastructure as Code) ainsi que du déploiement',
        'Github Actions, Terraform, Ansible',
        TRUE,
        FALSE,
        FALSE,
        FALSE,
        TRUE,
        TRUE
    );