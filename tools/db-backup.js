
const S3 = require('aws-sdk/clients/s3');
const sh = require('shelljs');
const moment = require('moment');
const fs = require('fs');
require('dotenv').config();

const { DATABASE_NAME } = process.env;

sh.exec('mkdir dumps');
sh.exec(`mongodump -d=${DATABASE_NAME} -o=dumps`);

const date = moment(Date.now()).format('DD-MM-YYYY');
const archiveName = `${DATABASE_NAME}_${date}.tar.gz`;

sh.exec(`tar -zcvf ${archiveName} dumps`);

const file = fs.readFileSync(archiveName);

const S3Client = new S3({
    endpoint: 'https://storage.yandexcloud.net',
    secretAccessKey: process.env.S3_SERET_KEY,
    accessKeyId: process.env.S3_SECRET_ID,
});

S3Client.upload({
    Bucket: 'mi-backups',
    Key: archiveName,
    Body: file,
    ContentType: 'application/tar+gzip',
}, (err, data) => {
    if (err) {
        throw err;
    }

    sh.exec(`rm -rf dumps`);
    sh.exec(`rm -rf ${archiveName}`);
})

