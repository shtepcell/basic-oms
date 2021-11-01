const Settings = require("../models/Settings");

const DEFAULT_CONFIG = {
    defaultTimeout: 15,
}

const getAppConfiguration = async (req, res, next) => {
    const config = await Settings.findOne({ type: 'app' }).lean() || DEFAULT_CONFIG;
    
    res.locals.config = config;

    next();
}

module.exports = {
    getAppConfiguration,
}