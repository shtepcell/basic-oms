const { SECRET_KEY, DATABASE_NAME } = process.env;

module.exports = {
    staticFolder: 'static',
    cacheTTL: 30000,
    sessionSecret: SECRET_KEY || 'REPLACE_ME_WITH_RANDOM_STRING',
    database: {
        port: 27017,
        url: "localhost",
        name: DATABASE_NAME || "basic-oms"
    }
};
