const express = require("express");
const router = express.Router();
const { getData } = require("../utils_db");
const { getFileContent, listFilesInBucket } = require('../utils_s3');
const { authenticateJWT } = require("./utilisateurs");

/**
 * @desc Lister les expériences
 */
router.get("/experiences", (req, res, next) => {
    // Define the query
    SQLquery = "SELECT * FROM experiences ORDER BY c_année_début DESC;"
    getData(SQLquery)
        .then((data) => {
            res.render('experiences.ejs',
                {
                    experiences: data,
                    title: req.app.locals.title
                });
        });
});

/**
 * @desc Voir le détail d'une expérience
 */
router.get("/E5/projet-perso", async (req, res, next) => {
    var id = 'E5perso';
    let bucketName = "portfolio-bts";
    let title = "Portfolio - E5 personnel"
    // Obtenir les informations de base du projet
    
    try {
        // Fetch project data
        const projet_data = await getData(`SELECT * FROM projets WHERE projet_id = $1;`, [id]);

        if (projet_data.length === 0) {
            res.status(404).send("Project not found");
            return;
        }
        const dbFiles = await getData('SELECT * FROM projets_docs WHERE projet_id = $1;', [id]);


        // Fetch files from S3
        const s3Files = await listFilesInBucket(bucketName, 'projet', id);

        // Match database entries with S3 keys and fetch content for text and JSON files
        const files = await Promise.all(dbFiles.map(async (dbFile) => {
            const s3File = s3Files.find(s3File => s3File.key.includes(dbFile.media_key));
            if (s3File) {
                const fileContent = await getFileContent(bucketName, s3File.key);
                return { ...dbFile, url: s3File.url, content: fileContent };
            }
            return dbFile;
        }));

        res.render('projet_view.ejs',
            {
                projet: projet_data[0],
                title: title,
                files: files,
                nonce: res.locals.nonce, // Pass nonce to template
            });

    } catch (error) {
        console.error('Error fetching files:', error);
        res.render('projet_view.ejs',
            {
                projet: {},
                title: title,
                files: [],
                nonce: res.locals.nonce, // Pass nonce to template
            });
    }
});

/**
 * @desc Voir le détail du projet professionel
 */
router.get("/E5/projet-pro", authenticateJWT, async (req, res, next) => {
    const id = 'E5pro';
    const bucketName = "portfolio-bts";
    const title = "Portfolio - E5 pro"

    try {
        // Fetch project data
        const projet_data = await getData(`SELECT * FROM projets WHERE projet_id = $1;`, [id]);

        if (projet_data.length === 0) {
            res.status(404).send("Project not found");
            return;
        }
        const dbFiles = await getData('SELECT * FROM projets_docs WHERE projet_id = $1;', [id]);


        // Fetch files from S3
        const s3Files = await listFilesInBucket(bucketName, 'projet', id);

        // Match database entries with S3 keys and fetch content for text and JSON files
        const files = await Promise.all(dbFiles.map(async (dbFile) => {
            const s3File = s3Files.find(s3File => s3File.key.includes(dbFile.media_key));
            if (s3File) {
                const fileContent = await getFileContent(bucketName, s3File.key);
                return { ...dbFile, url: s3File.url, content: fileContent };
            }
            return dbFile;
        }));

        res.render('projet_view.ejs',
            {
                projet: projet_data[0],
                title: title,
                files: files,
                nonce: res.locals.nonce, // Pass nonce to template
            });

    } catch (error) {
        console.error('Error fetching files:', error);
        res.render('projet_view.ejs',
            {
                projet: {},
                title: title,
                files: [],
                nonce: res.locals.nonce, // Pass nonce to template
            });
    }
});


// Export the router object so index.js can access it
module.exports = router;