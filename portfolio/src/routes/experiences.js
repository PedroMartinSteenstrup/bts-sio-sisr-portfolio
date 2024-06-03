const express = require("express");
const router = express.Router();
const getData = require("../utils_db").getData;
const { uploadFileAndSavePath, listFilesInBucket } = require('../utils_s3');
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
router.get("/E5/projet-perso", (req, res, next) => {
    var id = 'E5perso';
    let bucketName = "portfolio-bts";
    let title = "Portfolio - E5 personnel"
    // Obtenir les informations de base du projet
    getData(`SELECT * FROM projets WHERE projet_id = $1;`, [id])
        .then((projet_data) => {
            try {
                // puis obtenir la liste des documents
                const getDocsQuery = 'SELECT * FROM projets_docs WHERE projet_id = $1';
                getData(getDocsQuery, [id])
                    .then(async (dbFiles) => {
                        console.log(`dbFiles: =====>`);
                        console.log(dbFiles);
                        const s3Files = await listFilesInBucket(bucketName, id);
                        console.log(`s3Files: =====>`);
                        console.log(s3Files);
                        // on match les entrées db avec les clé sur s3
                        const files = dbFiles.map(dbFile => {
                            const s3File = s3Files.find(s3File => s3File.key.includes(dbFile.media_key));
                            return s3File ? { ...dbFile, url: s3File.url } : dbFile;
                        });
                        console.log(files);
                        console.log(projet_data[0]);
                        res.render('projet_view.ejs',
                            {
                                projet: projet_data[0],
                                title: title,
                                files: files,
                                nonce: res.locals.nonce, // Pass nonce to template
                            });
                    });
            } catch (error) {
                console.error('Error fetching files:', error);
                res.render('projet_view.ejs',
                    {
                        projet: projet_data[0],
                        title: title,
                        nonce: res.locals.nonce, // Pass nonce to template
                    });
            }
        });
});

/**
 * @desc Voir le détail du projet professionel
 */
router.get("/E5/projet-pro", authenticateJWT, (req, res, next) => {
    var id = 'E5pro';
    let bucketName = "portfolio-bts";
    let title = "Portfolio - E5 pro"

    // Define the query
    getData(`SELECT * FROM projets WHERE projet_id = $1;`, [id])
        .then((projet_data) => {
            try {
                getData('SELECT * FROM projets_docs WHERE projet_id = $1;', [id])
                    .then(async (dbFiles) => {
                        console.log(`dbFiles: =====>`);
                        console.log(dbFiles);
                        const s3Files = await listFilesInBucket(bucketName, id);
                        console.log(`s3Files: =====>`);
                        console.log(s3Files);
                        // on match les entrées db avec les clé sur s3
                        const files = dbFiles.map(dbFile => {
                            const s3File = s3Files.find(s3File => s3File.key.includes(dbFile.media_key));
                            return s3File ? { ...dbFile, url: s3File.url } : dbFile;
                        });
                        console.log(files);
                        res.render('projet_view.ejs',
                            {
                                projet: projet_data[0],
                                title: title,
                                files: files,
                                nonce: res.locals.nonce, // Pass nonce to template
                            });
                    });
            } catch (error) {
                console.error('Error fetching files:', error);
                res.render('projet_view.ejs',
                    {
                        projet: projet_data[0],
                        title: title,
                        nonce: res.locals.nonce, // Pass nonce to template
                    });
            }
        });
});


// Export the router object so index.js can access it
module.exports = router;