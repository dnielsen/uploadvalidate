require('dotenv').config();

module.exports = {
    aws: {
        IAM_USER_KEY: process.env.IAM_USER_KEY,
        IAM_USER_SECRET: process.env.IAM_USER_SECRET,
        BUCKET_NAME: process.env.BUCKET_NAME
    }
};