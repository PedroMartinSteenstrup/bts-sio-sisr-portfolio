const AWS = require('aws-sdk');
const insertData = require("./utils_db").insertData;

// Configure the AWS SDK for OVH Object Storage
const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('https://s3.rbx.io.cloud.ovh.net'), // region dependent
    accessKeyId: process.env.OVH_ACCESS_KEY_ID, // OVH access key
    secretAccessKey: process.env.OVH_SECRET_ACCESS_KEY, // OVH secret key
    region: 'rbx'
});

async function uploadFileAndSavePath(realisationId, filePath, bucketName) {
    const fileName = require('path').basename(filePath);
    const fs = require('fs');
    const re = new RegExp('https:\/\/portfolio-bts\.s3\.rbx\.io\.cloud\.ovh\.net\/([a-zA-Z.]*)')

    // Read the file
    const fileContent = fs.readFileSync(filePath);

    // Upload the file to OVH Object Storage
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        const fileUrl = uploadResult.Location;
        const filekey = uploadResult.Key;
        const mediaType = "logo";

        const sqlQuery = 'INSERT INTO realisations_docs (realisation_id, media_type, media_path, media_key) VALUES ($1, $2, $3, $4) RETURNING realisation_id';
        const values = [realisationId, mediaType, fileUrl, filekey]
        // Save the file path in the database
        const result = await insertData(sqlQuery, values)
            .then(result => {
                console.log('Data inserted successfully:', result.rows[0]);
            })
            .catch(error => {
                console.error('Error inserting data:', error);
            });

        console.log('File uploaded and path saved successfully');
    } catch (error) {
        console.error('Error uploading file or saving path:', error);
        throw error;
    }
}
async function listFilesInBucket(bucketName, realisationId) {
    const params = {
        Bucket: bucketName,
        // Prefix: `${realisationId}/` // Assuming files are stored in folders named by realisationId
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents.map(item => ({
            key: item.Key,
            url: s3.getSignedUrl('getObject', {
                Bucket: bucketName,
                Key: item.Key,
                Expires: 60 * 60 // URL expiration time in seconds
            })
        }));
    } catch (error) {
        console.error('Error listing objects in bucket:', error);
        throw error;
    }
};


module.exports = {
    uploadFileAndSavePath,
    listFilesInBucket
};