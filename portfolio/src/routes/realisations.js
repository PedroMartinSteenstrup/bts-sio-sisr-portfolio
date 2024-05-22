const express = require("express");
const fileUpload = require('express-fileupload');
const path = require('path');
const router = express.Router();
const getData = require("../db").getData;
const {uploadFileAndSavePath, listFilesInBucket} = require('../s3');

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
                { realisations: data, title: req.app.locals.title });
        });
});

/**
 * @desc Voir le détail d'une réalisation
 */
router.get("/realisation/:id", (req, res, next) => {
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
                        console.log(dbFiles);
                        const s3Files = await listFilesInBucket(bucketName, id);

                        const files = dbFiles.map(dbFile => {
                            const s3File = s3Files.find(s3File => s3File.key.includes(dbFile.file_name));
                            return s3File ? { ...dbFile, url: s3File.url } : dbFile;
                        });
                        res.render('realisation_view.ejs',
                            {
                                realisation: data[0],
                                title: req.app.locals.title,
                                files: files
                            });
                    });
            } catch (error) {
                console.error('Error fetching files:', error);
                res.render('realisation_view.ejs',
                    {
                        realisation: data[0],
                        title: req.app.locals.title
                    });
            }
        });


});

// Enable files upload
router.use(fileUpload({
    createParentPath: true
}));

// Route to render the upload form
router.get('/upload', (req, res) => {
    res.render('upload.ejs');
});

// Route to handle the file upload
router.post('/upload', async (req, res) => {
    try {
        const realisationId = req.body.realisationId;
        const file = req.files.file; // Access the uploaded file

        // Define the path to save the uploaded file temporarily
        const uploadPath = path.join(__dirname, 'uploads', file.name);

        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            const bucketName = 'portfolio-bts'; // Replace with your actual bucket name

            try {
                await uploadFileAndSavePath(realisationId, uploadPath, bucketName);
                res.send('File uploaded and path saved successfully');
            } catch (error) {
                console.error('Error during file upload and save path:', error);
                res.status(500).send('Error during file upload and save path');
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
});


// Export the router object so index.js can access it
module.exports = router;