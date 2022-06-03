const { FIELDS_HASH, CITY_TYPES_HASH, SERVICES_HASH, RELATION_NEEDED_SERVICES, IP_NEEDED_SERVICES, VOLUME_NEEDED_SERVICES } = require("./constants");

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


module.exports.getService = (data) => {
    const service = data[FIELDS_HASH.service];

    return SERVICES_HASH[service];
};

module.exports.isRelationNeeded = (data) => {
    return RELATION_NEEDED_SERVICES.includes(this.getService(data));
}

module.exports.isIPNeeded = (data) => {
    return IP_NEEDED_SERVICES.includes(this.getService(data));
}

module.exports.isCapacityNeeded = (data) => {
    return VOLUME_NEEDED_SERVICES.includes(this.getService(data));
}
