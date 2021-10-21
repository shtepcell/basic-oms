const { render } = require('../render');
const Settings = require('../models/Settings');

const WHITELIST_SETTINGS = ['auto-deadline'];

const getConfigurationPage = async(req, res) => {
    const dbQuery = WHITELIST_SETTINGS.map(item => ({ type: item }));
    const settings = await Settings.find({ '$or': dbQuery }).lean();

    return render(req, res, { viewName: 'admin/configuration' }, { settings });
}

const updateConfiguration = async(req, res) => {
    try {

        const { settings = [] } = req.body;

        const promises = [];

        settings.filter(({ type }) => WHITELIST_SETTINGS.includes(type)).forEach(({ type, data }) => {
            if (type === 'auto-deadline' && !Number.isInteger(Number(data))) {
                console.warn('Wrong auto-deadline value');
                throw new Error('Wrong auto-deadline value');
            }

            promises.push(Settings.findOne({ type }).then(item => {
                item.data = data;
                
                return item.save();
            }));
        });

        await Promise.all(promises);
        
        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    } 
}

module.exports = {
    getConfigurationPage,
    updateConfiguration,
}