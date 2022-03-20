const { FIELDS_HASH, CITY_TYPES_HASH } = require("./constants");

module.exports.getProvider = (data) => {
    const value = data[FIELDS_HASH.provider];

    if (!value) {
        return undefined;
    }

    let [type, name] = value.trim().split(/] /);

    type = type.slice(1);

    return { type, name };
};

module.exports.getCity = (data) => {
    const name = data[FIELDS_HASH.cityName];
    const cityType = data[FIELDS_HASH.cityType];

    const type = CITY_TYPES_HASH[cityType.toLowerCase()] || cityType;

    return { type, name };
};
