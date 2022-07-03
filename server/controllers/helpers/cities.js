const citiesMapper = (cities) => cities.map(({ type, name, _id }) => ({ label: `${type} ${name}`, id: _id })).filter(({ label }) => label !== 'г. Другое');

module.exports = {
    citiesMapper
}
