const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS S3 with explicit version 2 approach
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Simplified multer-s3 configuration
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const extension = file.originalname.split('.').pop();
            cb(null, `products/${uuidv4()}.${extension}`);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

module.exports = { upload };