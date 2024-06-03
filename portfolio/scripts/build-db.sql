-- autocommit is deactivated
-------------- certaines dates étaient malformées, ou type US
SET datestyle to SQL,
    DMY;
-------------- tout faire dans une grand transaction
BEGIN TRANSACTION;
SET search_path TO public;
---------------------------------------------
-------------- CREER LES TABLES -------------
---------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    set_name TEXT NOT NULL,
    set_value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    c_bloc TEXT NOT NULL,
    c_titre TEXT NOT NULL,
    c_description TEXT NOT NULL,
    c_année TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    c_année_début TEXT NOT NULL,
    c_année_fin TEXT NOT NULL,
    c_employeur TEXT NOT NULL,
    c_titre TEXT NOT NULL,
    c_description TEXT NOT NULL
);
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
    est_developpement_pro BOOLEAN,
    realisation_id INT UNIQUE
);
CREATE TABLE IF NOT EXISTS realisations_docs (
    id SERIAL PRIMARY KEY,
    realisation_id INT,
    media_type VARCHAR(15),
    media_path VARCHAR(255),
    media_key VARCHAR(100),
    FOREIGN KEY (realisation_id) REFERENCES realisations(realisation_id)
);
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    m2p_hash text not null UNIQUE,
    cree_le TIMESTAMPTZ NOT NULL default now()
);
CREATE TABLE IF NOT EXISTS projets (
    id SERIAL PRIMARY KEY,
    p_intitule TEXT NOT NULL,
    p_description TEXT NOT NULL,
    projet_id TEXT UNIQUE
);
CREATE TABLE IF NOT EXISTS projets_docs (
    id SERIAL PRIMARY KEY,
    projet_id TEXT,
    media_type VARCHAR(15),
    media_path VARCHAR(255),
    media_key VARCHAR(100),
    FOREIGN KEY (projet_id) REFERENCES projets(projet_id)
);
-----------------------------------------------
------------- INSERTS CI-DESSOUS --------------
-----------------------------------------------
INSERT INTO courses (c_bloc, c_titre, c_description, c_année)
VALUES (
        'Bloc 1',
        'Support et mise à disposition de services informatiques',
        'Le bloc de compétences 1 « Support et mise à disposition des services informatiques » vise à acquérir les compétences nécessaires à l''exercice d''activités de support et de mise à disposition de services informatiques pour répondre aux besoins d''une organisation cliente.',
        '2 Année'
    ),
    (
        'Bloc 2',
        'Administration des systèmes et des réseaux',
        'Le Bloc 2 de compétences professionnelles option SISR « Administration des systèmes et des réseaux » vous permettra de construire les savoirs et savoir-faire liés à la conception, à l''installation et à l''administration d''une infrastructure réseau pour répondre aux besoins d''une organisation cliente. Il vous permettra également de consolider les techniques de résolution d''incidents liés aux composants réseaux, systèmes et services et de perfectionner les techniques de rédaction d''un compte rendu, d''une documentation, d''une procédure d''installation et de configuration.',
        '2 Année'
    ),
    (
        'Bloc 3',
        'Cybersécurité des services informatiques',
        'Le Bloc 3 de compétences professionnelles « Cybersécurité des services informatiques » vous permettra d''acquérir les compétences nécessaires pour répondre aux besoins de sécurité des services informatiques d''une organisation notamment au regard du développement des menaces et attaques en provenance d''internet et des risques liés aux usages numériques.',
        '2 Année'
    ),
    (
        'Bloc 4',
        'Culture générale et expression',
        '',
        '2 Année'
    ),
    (
        'Bloc 5',
        'Expression et communication en langue anglaise',
        'Le niveau B2 du CECR est attendu à l''épreuve d''anglais',
        '2 Année'
    ),
    (
        'Bloc 6',
        'Mathématiques pour l''informatique',
        'Le Bloc 6 « Mathématiques pour l''informatique » vise à acquérir les bases mathématiques nécessaires à la compréhension et la maitrise des finalités spécifiques du BTS SIO et des démarches mathématiques permettant d''en appréhender la pertinence et l''efficacité pour évoluer dans un environnement numérique.',
        '2 Année'
    ),
    (
        'Bloc 7',
        'Culture économique, juridique et managériale pour l''informatique',
        'Au fil des années l''environnement des entreprises s''est complexifié. Vous serez amené à évoluer au sein d''une organisation possédant ses propres logiques de fonctionnement. Il devient opportun de vous préparer à œuvrer dans cet environnement en vous proposant de lier les trois disciplines, économie, droit et management dans ce parcours de Culture économique juridique et managériale pour l''informatique.',
        '2 Année'
    );
INSERT INTO experiences (
        c_année_début,
        c_année_fin,
        c_employeur,
        c_titre,
        c_description
    )
VALUES (
        '2023',
        'présent',
        'HomeToGo (Berlin)',
        'Data Platform Engineer',
        'Je développe et maintiens des applications métiers pour l''équipe Données et l''entreprise en général'
    ),
    (
        '2020',
        '2022',
        'Wise (Londres), HomeToGo (Berlin)',
        'Analytics Engineer',
        'Gestion de la base de données analytique et du corpus de script'
    ),
    (
        '2017',
        '2020',
        'TransferWise (Tallinn, Londres)',
        'Data Analyst',
        'Mise en place d''indicateurs de performance, de solutions de visualisation et de scripts d''extraction de données'
    ),
    (
        '2016',
        '2017',
        'TransferWise (Tallinn)',
        'Support Client',
        'Répondre aux requêtes des clients francophones par email, téléphone et chat.'
    ),
    (
        '2015',
        '2016',
        'Conseil Départemental 62 (Arras)',
        'Gestionnaire de projets',
        'Suivi administratif de projets de coopération transfrontalière.'
    ),
    (
        '2013',
        '2014',
        'Haché (Copenhague)',
        'Cuisinier',
        'Préparation de Burgers gourmets.'
    ),
    (
        '2013',
        '2013',
        'North Sea Region Programme (Viborg)',
        'Stagiaire',
        'Réflexion et consultation sur les indicateurs de performance.'
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
        est_developpement_pro,
        realisation_id
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
        TRUE,
        1
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
        TRUE,
        2
    ),
    (
        '05-03-2024',
        '30-04-2024',
        'Configuration d''une application javascript sur une infrastructure Cloud',
        'DNS, Pare-feu, Routing, déploiement sur ovh, configuration Cloudflare',
        TRUE,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        FALSE,
        3
    ),
    (
        '01-09-2023',
        '12-12-2023',
        'Constitution d''une maquette de l''ensemble d''une infrastructure réseau',
        'Packet Tracer',
        TRUE,
        FALSE,
        FALSE,
        FALSE,
        FALSE,
        TRUE,
        4
    ),
    (
        '15-09-2022',
        '05-10-2022',
        'Synchronisation de la prise de note via Obsidian avec hébergement centralisé sur un NAS accessible à distance via VPN et localement via partage de fichiers',
        'OpenVPN, Synology NAS, Ansible',
        TRUE,
        FALSE,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        5
    ),
    (
        '01-09-2022',
        '30-04-2024',
        'Sécurisation d''un serveur VPS, d''IOT',
        'iptables, ufw, configuration ssh, fail2ban',
        TRUE,
        FALSE,
        FALSE,
        FALSE,
        FALSE,
        TRUE,
        6
    ),
    (
        '20-04-2023',
        '07-06-2023',
        'Mise en place de la gouvernance d''une base de donnée (Snowflake) via IaC (Infrastructure as Code)',
        'Github Actions, Terraform, Snowflake',
        TRUE,
        TRUE,
        FALSE,
        TRUE,
        FALSE,
        FALSE,
        7
    ),
    (
        '20-04-2023',
        '07-06-2023',
        'Mise en place d''une solution d''intégration/déploiement continu(e) sur les services de l''équipe Infra',
        'Github Actions, CI/CD',
        FALSE,
        TRUE,
        FALSE,
        TRUE,
        TRUE,
        FALSE,
        8
    ),
    (
        '04-11-2023',
        '15-11-2023',
        'Création d''une suite de Tests Unitaires afin de vérifier le avant que le code ne soit promu en production.',
        'PyTest, Github Actions',
        FALSE,
        TRUE,
        FALSE,
        TRUE,
        TRUE,
        FALSE,
        9
    ),
    (
        '16-02-2022',
        '15-04-2022',
        'Passage de la gestion des identités et des accès aux applications métiers gérées par l''équipe Plateforme de Données à une solution centralisée',
        'SSO, Keycloak, Oauth2',
        TRUE,
        TRUE,
        FALSE,
        TRUE,
        FALSE,
        FALSE,
        10
    ),
    (
        '01-08-2022',
        '31-07-2023',
        'Suivi de la méthode agile avec des sprint de 1 semaine (planification, retrospective, préparation des tickets)',
        'JIRA',
        FALSE,
        TRUE,
        FALSE,
        TRUE,
        FALSE,
        FALSE,
        11
    ),
    (
        '15-02-2024',
        CURRENT_DATE,
        'Cartographie de l''architecture réseau de l''entreprise HomeToGo déployée sur AWS et bare metal (revue de code, inspection matériel)',
        'Terraform, Terragrunt, Atlantis',
        TRUE,
        TRUE,
        FALSE,
        TRUE,
        FALSE,
        FALSE,
        12
    ),
    (
        '30-01-2024',
        '21-02-2024',
        'Déploiement d''une application métier sur un système d''orchestration de services conteneurisés',
        'Kubernetes',
        TRUE,
        TRUE,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        13
    ),
    (
        '03-12-2023',
        '01-02-2024',
        'Mise à jour majeure d''une application métier avec migration de la base de données',
        'Postgres, Superset, Docker',
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        14
    );
INSERT INTO projets (p_intitule, p_description, projet_id)
VALUES (
        'Recensement des réseaux sur le compte AWS principal et ses sous-comptes',
        'Les attentes de l''équipe qui m''a proposé ce travail sont (1) de leur procurer un document support sur lesquels baser les discussions, et (2) des pistes pour un meilleur addressage des ressources internes.',
        'E5pro'
    ),
    (
        'Mise en place d''une infrastructure type pour un espace de co-working avec pépinière d''entreprise',
        'Les missions poposées sont de (1) mettre en place l''infrastructure du site du client, (2) évolution de l''architecture système pour l''accueil d''un nouveau client et (3) sécurisation et mise en place de la tolérance de pannes des équipements réseaux',
        'E5perso'
    );
COMMIT;