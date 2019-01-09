module.exports = {
    staticFolder: 'static',
    defaultPort: 3010,
    cacheTTL: 30000,
    sessionSecret: 'REPLACE_ME_WITH_RANDOM_STRING',
    database: {
        port: 27017,
        url: "localhost",
        name: "basic-oms"
    }
};
