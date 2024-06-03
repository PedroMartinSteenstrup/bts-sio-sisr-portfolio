const express = require("express");
const fileUpload = require('express-fileupload');
const path = require('path');
const router = express.Router();
const { uploadFileAndSavePath, listFilesInBucket } = require('../utils_s3');
const { authenticateJWT } = require('./utilisateurs');

// Enable files upload
router.use(fileUpload({
    createParentPath: true
}));

// Route to render the upload form
router.get('/upload', authenticateJWT, (req, res) => {
    res.render('upload.ejs');
});

// Route to handle the file upload
router.post('/upload', async (req, res) => {
    try {
        const realisationId = req.body.realisationId;
        const docType = req.body.doctype;
        const mediaType = req.body.mediatype;
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
                await uploadFileAndSavePath(realisationId, docType, mediaType, uploadPath, bucketName);
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