const express = require("express");
const path = require('path');
const router = express.Router();
const getData = require("../utils_db").getData;
const { listFilesInBucket } = require('../utils_s3');

/**
 * @desc Lister toutes les réalisations recensées
 */

// Redirect route
router.get('/E4', (req, res) => {
    res.redirect(301, '/realisations');
});

router.get("/realisations", (req, res, next) => {
    // Define the query
    SQLquery = "SELECT * FROM realisations ORDER BY r_début DESC;"
    getData(SQLquery)
        .then((data) => {
            res.render('realisations.ejs',
                {
                    realisations: data,
                    title: req.app.locals.title
                });
        });
});

/**
 * @desc Voir le détail d'une réalisation
 */
router.get("/realisation/:id", async (req, res, next) => {
    let bucketName = "portfolio-bts";
    try {
        // Define the query to obtain the realisation_id from the database
        const projet_data = await getData(`SELECT * FROM realisations WHERE id = $1::int;`, [req.params.id]);
        const realisation_id = projet_data[0].realisation_id;

        if (projet_data.length === 0) {
            res.status(404).send("Project not found");
            return;
        }
        const dbFiles = await getData('SELECT * FROM realisations_docs WHERE realisation_id = $1::int', [projet_data[0].realisation_id]);

        // Fetch files from S3
        const s3Files = await listFilesInBucket(bucketName, 'projet', projet_data[0].realisation_id);

        const getDocsQuery = 'SELECT * FROM realisations_docs WHERE realisation_id = $1::int';
        getData(getDocsQuery, [realisation_id])
            .then(async (dbFiles) => {
                const s3Files = await listFilesInBucket(bucketName, 'realisation', realisation_id);
                // on match les entrées db avec les clé sur s3
                const files = dbFiles.map(dbFile => {
                    const s3File = s3Files.find(s3File => s3File.key.includes(dbFile.media_key));
                    return s3File ? { ...dbFile, url: s3File.url } : dbFile;
                });

                res.render('realisation_view.ejs',
                    {
                        realisation: projet_data[0],
                        title: req.app.locals.title,
                        files: files,
                        nonce: res.locals.nonce, // Pass nonce to template
                    });
            });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.render('realisation_view.ejs',
            {
                realisation: projet_data[0],
                title: req.app.locals.title,
                nonce: res.locals.nonce, // Pass nonce to template
            });
    }
});


// Export the router object so index.js can access it
module.exports = router;