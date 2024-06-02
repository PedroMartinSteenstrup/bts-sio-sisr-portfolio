const express = require("express");
const router = express.Router();
const getData = require("../utils_db").getData;
const { uploadFileAndSavePath, listFilesInBucket } = require('../utils_s3');

/**
 * @desc Display all the users
 */
router.get("/experiences", (req, res, next) => {
    // Define the query
    SQLquery = "SELECT * FROM experiences ORDER BY c_année_début DESC;"
    console.log(SQLquery)

    getData(SQLquery)
        .then((data) => {
            console.log(data)
            res.render('experiences.ejs',
                { experiences: data, title: req.app.locals.title });
        });
});

/**
 * @desc Voir le détail d'une réalisation
 */
router.get("/E5/projet-perso", (req, res, next) => {
    var id = req.params.id;
    let bucketName = "portfolio-bts";
    // Define the query
    SQLquery = `SELECT * FROM realisations WHERE id = $1::int;`
    getData(SQLquery, [id])
        .then((data) => {
            try {
                const getDocsQuery = 'SELECT * FROM realisations_docs WHERE realisation_id = $1::int';
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
                        res.render('projet_view.ejs',
                            {
                                realisation: data[0],
                                title: req.app.locals.title,
                                files: files,
                                nonce: res.locals.nonce, // Pass nonce to template
                            });
                    });
            } catch (error) {
                console.error('Error fetching files:', error);
                res.render('projet_view.ejs',
                    {
                        realisation: data[0],
                        title: req.app.locals.title,
                        nonce: res.locals.nonce, // Pass nonce to template
                    });
            }
        });
});

/**
 * @desc Voir le détail du projet professionel
 */
router.get("/E5/projet-pro", (req, res, next) => {
    var id = req.params.id;
    let bucketName = "portfolio-bts";
    // validate if user is allowed
    const reject = () => {
        res.setHeader("www-authenticate", "Basic");
        res.sendStatus(401);
    };

    const authorization = req.headers.authorization;

    if (!authorization) {
        return reject();
    }

    const [username, password] = Buffer.from(
        authorization.replace("Basic ", ""),
        "base64"
    )
        .toString()
        .split(":");

    if (!(username === "ben" && password === "my-favorite-password")) {
        return reject();
    }
    // Define the query
    SQLquery = `SELECT * FROM realisations WHERE id = $1::int;`
    getData(SQLquery, [id])
        .then((data) => {
            try {
                const getDocsQuery = 'SELECT * FROM projets_docs WHERE projet_id = $1::int AND est_projet_pro';
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
                        res.render('projet_view.ejs',
                            {
                                realisation: data[0],
                                title: req.app.locals.title,
                                files: files,
                                nonce: res.locals.nonce, // Pass nonce to template
                            });
                    });
            } catch (error) {
                console.error('Error fetching files:', error);
                res.render('projet_view.ejs',
                    {
                        realisation: data[0],
                        title: req.app.locals.title,
                        nonce: res.locals.nonce, // Pass nonce to template
                    });
            }
        });
});


// Export the router object so index.js can access it
module.exports = router;