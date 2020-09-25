const Departments = require('../../server/models/Department');
const Cities = require('../../server/models/City');
const xl = require('excel4node');


(async () => {
    const cities = await Cities.find();

    const promises = cities.map(city => {
        return Departments.findOne({ cities: city._id }).then(res => {
            const result = { city: `${city.type} ${city.name}` };

            res && (result.department = res.name);

            return result;
        });
    })


    const results = await Promise.all(promises);

    const wb = new xl.Workbook();
    const table = wb.addWorksheet('Таблица 1');

    results.forEach(({ city, department = 'Не привязан к отделу' }, index) => {
        table.cell(1 + index, 1).string(city);
        table.cell(1 + index, 2).string(department);
    })

    wb.write('cities.xlsx');

    // process.exit(0);
})()