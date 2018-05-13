const Order = require('../models/Order');
const Department = require('../models/Department');
const Account = require('../models/Account');
const Client = require('../models/Client');
const Provider = require('../models/Provider');
const City = require('../models/City');
const Street = require('../models/Street');
const Holiday = require('../models/Holiday');
const Notify = require('../models/Notify');
const helper = require('./helper');

module.exports = {

    client: async (name) => {

        if(!name)
            return 'Клиент - обязательное поле!';

        var clnt = await Client.findOne({ name: name });

        if(!clnt)
            return 'Такого клиента не существует!';

        return clnt;

    },

    street: async (name) => {

        if(!name)
            return 'Улицу указывать обязательно!';

        var strt = helper.parserStreet(name);

        if(strt == 'err')
            return 'Формат улицы неверный!';

        strt = await Street.findOne({ type: strt.type, name: strt.name });

        if(!strt)
            return 'Такой улицы не существует. Обратитесь к администратору!';

        return strt;
    },

    city: async (name) => {

        if(!name)
            return 'Город указывать обязательно!';

        var city = helper.parserCity(name);

        if(city == 'err')
            return 'Формат города неверный! Следует писать так - г./c./пос./пгт. Симферополь';

        city = await City.findOne({ type: city.type, name: city.name });

        if(!city)
            return 'Такого города не существует!'

        return city;
    }

};
