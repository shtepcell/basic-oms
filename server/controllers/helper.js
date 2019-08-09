const Department = require('../models/Department');
const Account = require('../models/Account');
const Client = require('../models/Client');
const Provider = require('../models/Provider');
const City = require('../models/City');
const Street = require('../models/Street');
const Holiday = require('../models/Holiday');
const Flag = require('../models/Flag');

const common = require('../common-data');

module.exports = {

    trimObject: function (obj) {
        Object.keys(obj).forEach(i => {
            try {
                obj[i] = obj[i].trim();
            } catch (err) { console.log('Cannot trim field') }
        })
        return obj;
    },

    findStageDate: function (name, order) {
        var history = order.history,
            res;

        for (var i = 0; i < history.length; i++) {
            if (name == history[i].name) res = history[i].date;
        }

        return res;
    },

    calculatePauseTime: function (order) {
        var history = order.history,
            res = 0;

        for (var i = 0; i < history.length; i++) {
            if ('Пауза' == history[i].name) {
                let start = history[i].date,
                    end;

                if (i + 1 < history.length) {
                    end = history[i + 1].date;
                }

                if (!end) {
                    end = new Date();
                }

                res += end - start;
            }
        }
        return Math.ceil(res / (1000 * 3600 * 24));
    },

    historyGenerator: function (type, user, opt) {
        var usr = `[${user.department.name}] ${user.name}`,
            now = new Date(),
            ret = { author: usr, date: now };

        switch (type) {
            case 'init':
                ret.name = 'Инициация заказа';
                break;
            case 'admin':
                ret.name = 'Административная правка';
                break;
            case 'gzp-pre':
                ret.name = 'Проработка ГЗП';
                break;
            case 'stop-pre':
                ret.name = 'Проработка СТОП/VSAT';
                break;
            case 'pause-start':
                ret.name = 'Пауза';
                break;
            case 'pause-stop':
                ret.name = 'Снятие с паузы';
                break;
            case 'delete':
                ret.name = 'Заказ удалён';
                break;
            case 'reject':
                ret.name = 'Заказ отклонён';
                break;
            case 'network':
                ret.name = 'Настройка сети';
                break;
            case 'gzp-build':
                ret.name = 'Организация ГЗП';
                break;
            case 'sks-pre':
                ret.name = 'Проработка СКС';
                break;
            case 'sks-build':
                ret.name = 'Реализация СКС';
                break;
            case 'install-devices':
                ret.name = 'Установка оборудования';
                break;
            case 'stop-build':
                ret.name = 'Организация СТОП/VSAT';
                break;
            case 'client-notify':
                ret.name = 'Уведомление клиента (заказ включен)';
                break;
            case 'comeback':
                ret.name = 'Возврат в организацию';
                break;
            case 'back':
                ret.name = 'Возврат на предудущий этап';
                break;
            case 'client-match':
                ret.name = 'Согласование с клиентом';
                break;
            case 'redirect':
                ret.name = `Зона ответсвенности изменена -> ${opt.department}`;
                break;
            case 'change-params':
                ret.name = `Обновление услуги/парметров услуги`;
                break;
            case 'request-pause':
                ret.name = `Запрос паузы`;
                break;
            case 'reject-pause':
                ret.name = `Отмена запроса паузы`;
                break;
            case 'change-order':
                ret.name = `Изменение ёмкости ${opt.from} -> ${opt.to}`;
                break;
            case 'start-pre-shutdown':
                ret.name = 'Запрос отключения услуги';
                break;
            case 'start-build-shutdown':
                ret.name = 'Отключение услуги. Запрос демонтажа';
                break;
            case 'start-stop-shutdown':
                ret.name = 'Отключение услуги. Запрос к СТОП';
                break;
            case 'shutdown':
                ret.name = 'Услуга отключена';
                break;
            case 'start-pause-service':
                ret.name = 'Начало приостановки сервиса. ГФСС';
                break;
            case 'start-stop-pause-service':
                ret.name = 'Начало приостановки сервиса. СТОП';
                break;
            case 'pause-service':
                ret.name = 'Выполнена приостановка сервиса';
                break;


            case 'start-pre-continue':
                ret.name = 'Начало возобновления. ГФСС';
                break;
            case 'start-stop-continue':
                ret.name = 'Начало возобновления. СТОП';
                break;
            case 'start-continue':
                ret.name = 'Возабновлено';
                break;
            case 'end-continue':
                ret.name = 'Заказ включен';
                break;


            case 'start-pre-change':
                ret.name = 'Начало изменения. ГФСС';
                break;
            case 'start-stop-change':
                ret.name = 'Начало изменения. СТОП';
                break;
            case 'start-change':
                ret.name = 'Изменено';
                break;
            case 'end-change':
                ret.name = 'Заказ включен';
                break;

            case 'start-network':
                ret.name = 'Начато: Настройка сети (Wi-Fi)'
                break;

            default:
                ret.name = 'Неизвестное событие'
                break;
        }
        return ret;
    },

    calculateCS: (order) => {
        if (!order.deadline) return null;
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        var cs = Math.round((order.deadline - now) / 1000 / 60 / 60 / 24);
        var pause = 0;
        if (order.pause && order.pause.status) {
            pause = order.pause.date;
            pause = Math.round((now - pause) / 1000 / 60 / 60 / 24) + 1;
        }
        return cs + pause;
    },

    dateToStr: function (value) {
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var day = value.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        return `${day}.${month}.${year}`;
    },

    dateToExtStr: function (value = new Date()) {
        var hour = value.getHours();
        if (hour < 10) {
            hour = '0' + hour;
        }
        var min = value.getMinutes();
        if (min < 10) {
            min = '0' + min;
        }
        var sec = value.getSeconds();
        if (sec < 10) {
            sec = '0' + sec;
        }
        return `${this.dateToStr(value)} ${hour}:${min}:${sec}`;
    },

    dateToChatStr: function (value = new Date()) {
        var now = new Date().getDate();

        if (now == value.getDate()) {
            var hour = value.getHours();
            if (hour < 10) {
                hour = '0' + hour;
            }
            var min = value.getMinutes();
            if (min < 10) {
                min = '0' + min;
            }
            return `${hour}:${min}`;
        } else {
            return this.dateToStr(value);
        }
    },

    strToDate: strToDate,

    parseDate: (date) => {
        if (!date) return false;

        date = date.split('.');

        if (date.length == 3) {
            if (date[1] >= 0 && date[1] <= 11 && date[0] > 0 && date[0] <= 31) {
                return new Date(date[2], date[1] - 1, date[0]);
            }
        }

        return false;
    },

    orderSort: (array, path, reverse) => {
        switch (path) {
            case 'id':
                path = 'id';
                break;
            case 'client':
                path = 'info.client.name';
                break;
            case 'adress':
                path = 'info.city.name';
                break;
            case 'service':
                path = 'info.service.name';
                break;
            case 'deadline':
                path = 'deadline';
                break;
            case 'status':
                path = 'status';
                break;
            case 'init':
                path = 'date.init';
                break;
        }

        var paths = path.split('.');

        array.sort((a, b) => {
            for (var i = 0; i < paths.length; i++) {
                a = a[paths[i]];
                b = b[paths[i]];
            }
            if (path == 'deadline') {
                if (a === null || a === undefined) {
                    a = 9999999999999;
                }
                if (b === null || b === undefined) {
                    b = 9999999999991;
                }
            }

            if (a < b) {
                return -1 * reverse;
            }

            if (a > b) {
                return 1 * reverse;
            }

            return 0;
        });

        return array;
    },

    getZone: async (order) => {
        const query = order.special
            ? { _id: order.special }
            : { cities: order.info.city._id };

        const dep = await Department.findOne(query);

        if (dep) {
            return dep.name;
        }

        return 'Неизвестно';
    },

    makeQuery: async (req, res) => {
        var qr = {};
        var query = req.query;
        var status = [];
        if (query.id) {
            let ids = query.id.split(' ');
            let ors = [];
            for (let i = 0; i < ids.length; i++) {
                if (!isNaN(ids[i])) {
                    ors.push({ id: ids[i] });
                }
            }

            if (ors.length > 0) {
                return { $or: ors };
            }

            return { id: -1 };
        }

        if (query.cms) {
            var rgx =  new RegExp('' + query.cms + '', 'i');
            return { 'info.cms': {$regex: rgx} }
        }

        if (query.func) {
            if (query.func.indexOf('1') >= 0) {
                qr['info.initiator'] = res.locals.__user._id;
            }

            if (query.func.indexOf('2') >= 0) {
                const today = new Date();
                today.setDate( today.getDate() - 1);
                var deadline = {
                    deadline: { '$ne': null },
                    $or: [
                        {
                            $and: [
                                { deadline: { '$lte': today } },
                                { "pause.status": { $ne: true } }
                            ]
                        },
                        { $where: "this.pause && this.deadline < this.pause.date" }
                    ]
                }
                qr['$and'] = [deadline];
            }
            if (query.func.indexOf('3') >= 0) {
                qr['pause.status'] = true;
            }

            if (query.func.indexOf('4') >= 0) {
                qr['info.cms'] = { $ne: null };
            }
        }

        if (query.func1) {
            query.func1.forEach(item => {
                const cpb = (value) => ({ '$or': [
                    { 'gzp.capability': value },
                    { 'stop.capability': value }
                ]});

                switch (item) {
                    case '1':
                        qr['$and'] ? qr['$and'].push(cpb(true)) : qr['$and'] = [cpb(true)];
                        break;

                    case '2':
                        qr['$and'] ? qr['$and'].push(cpb(false)) : qr['$and'] = [cpb(false)];
                        break;
                }
            })
        }

        if (query.manager) {
            let manager = await Account.find({ login: query.manager });

            if (qr['$and']) {
                qr['$and'].push({ 'info.initiator': manager })
            } else qr['$and'] = [{ 'info.initiator': manager }];
        }

        if (query.resp) {
            var resp;
            try {
                resp = await Department.findOne({ _id: query.resp + '' });
            } catch (err) { console.log('Cannot find department'); }
            var respQ = {};
            if (resp != null) {
                switch (resp.type) {
                    case 'b2b':
                        respQ = { 'info.department': resp._id };
                        break;
                    case 'b2o':
                        respQ = {
                            '$or': [
                                {
                                    '$or': [
                                        { status: 'client-match' },
                                        { status: 'client-notify' }

                                    ],
                                    'info.department': resp._id
                                },
                                { status: 'stop-build' },
                                { status: 'all-pre' },
                                { status: 'stop-pre' }
                            ]
                        }
                        break;
                    case 'gus':
                        respQ = {
                            'info.service': { $ne: 'rrl' },
                            $or: [
                                { status: 'gzp-pre', 'info.city': resp.cities, 'special': null },
                                { status: 'all-pre', 'info.city': resp.cities, 'special': null },
                                { status: 'gzp-pre', 'special': resp._id },
                                { status: 'all-pre', 'special': resp._id },
                                { status: 'gzp-build', 'info.city': resp.cities, 'special': null },
                                { status: 'install-devices', 'info.city': resp.cities, 'special': null },
                                { status: 'gzp-build', 'special': resp._id },
                                { status: 'install-devices', 'special': resp._id },
                                { status: 'build-shutdown', 'special': resp._id },
                                { status: 'build-shutdown', 'info.city': resp.cities, 'special': null }
                            ]
                        }
                        break;
                    case 'net':
                        respQ = {
                            $or: [
                                { status: 'network' },
                                { status: 'pre-shutdown' }
                            ]
                        };
                        break;
                    case 'sks':
                        respQ = {
                            '$or': [
                                { status: 'sks-pre' },
                                { status: 'sks-build' }
                            ]
                        };
                        break;
                }
            }

            if (qr['$and']) {
                qr['$and'].push(respQ);
            } else qr['$and'] = [respQ];
        }

        if (query.pre) {
            if (query.pre.indexOf('1') >= 0) {
                status.push({ status: 'gzp-pre' });
                status.push({ status: 'all-pre' });
            }
            if (query.pre.indexOf('2') >= 0) {
                status.push({ status: 'stop-pre' });
                if (status.indexOf({ status: 'all-pre' }) < 0) {
                    status.push({ status: 'all-pre' });
                }
            }
            if (query.pre.indexOf('3') >= 0) {
                status.push({ status: 'client-match' });
            }
            if (query.pre.indexOf('4') >= 0) {
                status.push({ status: 'sks-pre' });
            }
        }

        if (query.build) {
            if (query.build.indexOf('1') >= 0) {
                status.push({ status: 'gzp-build' });
            }
            if (query.build.indexOf('2') >= 0) {
                status.push({ status: 'install-devices' });
            }
            if (query.build.indexOf('3') >= 0) {
                status.push({ status: 'stop-build' });
            }
            if (query.build.indexOf('4') >= 0) {
                status.push({ status: 'network' });
            }
            if (query.build.indexOf('5') >= 0) {
                status.push({ status: 'client-notify' });
            }
            if (query.build.indexOf('6') >= 0) {
                status.push({ status: 'sks-build' });
            }
        }

        if (query.shutdown) {
            if (query.shutdown.indexOf('1') >= 0) {
                status.push({ status: 'pre-shutdown' });
            }
            if (query.shutdown.indexOf('2') >= 0) {
                status.push({ status: 'stop-shutdown' });
            }
            if (query.shutdown.indexOf('3') >= 0) {
                status.push({ status: 'build-shutdown' });
            }
            if (query.shutdown.indexOf('4') >= 0) {
                status.push({ status: 'shutdown' });
            }
        }

        if (query.pauseService) {
            if (query.pauseService.indexOf('1') >= 0) {
                status.push({ status: 'pre-pause' });
            }
            if (query.pauseService.indexOf('2') >= 0) {
                status.push({ status: 'stop-pause' });
            }
            if (query.pauseService.indexOf('3') >= 0) {
                status.push({ status: 'pause' });
            }
        }

        if (query.continue) {
            if (query.continue.indexOf('1') >= 0) {
                status.push({ status: 'pre-continue' });
            }
            if (query.continue.indexOf('2') >= 0) {
                status.push({ status: 'stop-continue' });
            }
            if (query.continue.indexOf('3') >= 0) {
                status.push({ status: 'continue' });
            }
        }

        if (query.change) {
            if (query.change.indexOf('1') >= 0) {
                status.push({ status: 'pre-change' });
            }
            if (query.change.indexOf('2') >= 0) {
                status.push({ status: 'stop-change' });
            }
            if (query.change.indexOf('3') >= 0) {
                status.push({ status: 'change' });
            }
        }

        if (query.final) {
            if (query.final.indexOf('1') >= 0) {
                status.push({
                    '$and': [
                        { status: 'succes' },
                        {
                            '$or': [
                                { 'date.gzp-build': { $ne: null } },
                                { 'date.install-devices': { $ne: null } }
                            ]
                        }
                    ]
                });
            }
            if (query.final.indexOf('2') >= 0) {
                status.push({
                    '$and': [
                        { status: 'succes' },
                        { 'date.stop-build': { $ne: null } }
                    ]
                });
            }
            if (query.final.indexOf('3') >= 0) {
                status.push({ status: 'reject' });
            }
        }

        if (status.length > 0) {
            if (qr['$or']) {
                qr['$or'] = qr['$or'].concat(status);
            } else {
                qr['$or'] = status;
            }
        }

        if (query.client) {
            var clnt = query.client;
            clnt = clnt.trim();
            // var rgx =  new RegExp('' + clnt + '', 'i');
            // clnt = await Client.find({name: {$regex: rgx}});
            clnt = await Client.find({ name: clnt });

            if (clnt.length > 0) {
                var _q = [];
                clnt.forEach(itm => {
                    _q.push({ 'info.client': itm._id });
                })
                qr['$and'] = [{ '$or': _q }];
            } else {
                qr['$and'] = [{ 'asdasd': 'asdasdasd' }]
            }
        }

        if (query.clientType) {
            if (qr['$and']) {
                qr['$and'].push({ 'info.clientType': query.clientType })
            } else qr['$and'] = [{ 'info.clientType': query.clientType }];
        }

        if (query.city) {
            var city = module.exports.parserCity(query.city);
            city = await City.find({ name: city.name, type: city.type });
            if (city.length > 0) {
                var _q = [];
                city.forEach(itm => {
                    _q.push({ 'info.city': itm._id });
                })
                if (qr['$and']) {
                    qr['$and'].push({ '$or': _q })
                } else qr['$and'] = [{ '$or': _q }];
            } else {
                qr['$and'] = [{ 'asdasd': 'asdasdasd' }]
            }
        }

        if (query.street) {
            var _street = module.exports.parserStreet(query.street.trim()),
                streetQuery = { 'asdasd': 'sadasdas' };

            if (_street == 'err') {
                var val = query.street.trim();
                val = val.replace(/\[/g, '');
                val = val.replace(/\]/g, '');
                val = val.replace(/\\/g, '');
                val = val.replace(/\(/g, '');
                val = val.replace(/\)/g, '');
                val = val.replace(/\*/g, '');

                let rgx = new RegExp('' + val + '', 'i');
                streetQuery = { 'info.adds': { $regex: rgx } };
            } else {
                street = await Street.findOne({ name: _street.name, type: _street.type });

                if (street) {
                    let rgx = new RegExp('' + _street.name + '', 'i');
                    streetQuery = {
                        $or: [
                            { 'info.street': street },
                            { 'info.adds': { $regex: rgx } }
                        ]
                    }
                } else {
                    let rgx = new RegExp('' + query.street + '', 'i');
                    streetQuery = { 'info.adds': { $regex: rgx } };
                }
            }

            if (qr['$and']) {
                qr['$and'].push(streetQuery)
            } else qr['$and'] = [streetQuery];
        }

        if (query.adress) {
            var val = query.adress;
            val = val.replace(/\[/g, '');
            val = val.replace(/\]/g, '');
            val = val.replace(/\\/g, '');
            val = val.replace(/\(/g, '');
            val = val.replace(/\)/g, '');
            var rgx = new RegExp('' + val + '', 'i');
            if (qr['$and']) {
                qr['$and'].push({ 'info.adds': { $regex: rgx } })
            } else qr['$and'] = [{ 'info.adds': { $regex: rgx } }];
        }

        if (query.service) {
            if (qr['$and']) {
                qr['$and'].push({ 'info.service': query.service })
            } else qr['$and'] = [{ 'info.service': query.service }];
        }

        if (query['date-status'] && (query['date-start'] != '' || query['date-end'] != '')) {
            var start,
                end;

            query['date-start'] = query['date-start'].trim();
            query['date-end'] = query['date-end'].trim();

            if (query['date-start'] == '') start = new Date(1990, 1, 1);
            else start = strToDate(query['date-start']);
            if (query['date-end'] == '') end = new Date(2200, 1, 1);
            else end = strToDate(query['date-end']);

            var _status;
            if (query['date-status']) {
                switch (query['date-status']) {
                    case 'init':
                        if (qr['$and']) {
                            qr['$and'].push({
                                'date.init': {
                                    $gte: start,
                                    $lte: end
                                }
                            })
                        } else {
                            qr['$and'] = [
                                { 'date.init': {  $gte: start, $lte: end }}
                            ];
                        }
                        break;
                    case 'gzp-pre':
                        if (qr['$and']) {
                            qr['$and'].push({
                                'date.gzp-pre': {
                                    $gte: start,
                                    $lte: end
                                }
                            })
                        } else {
                            qr['$and'] = [{
                                'date.gzp-pre': {
                                    $gte: start,
                                    $lte: end
                                }
                            }];
                        }
                        break;
                    case 'sks-pre':
                        if (qr['$and']) {
                            qr['$and'].push({
                                'date.sks-pre': {
                                    $gte: start,
                                    $lte: end
                                }
                            })
                        } else {qr['$and'] = [{
                            'date.sks-pre': {
                                $gte: start,
                                $lte: end
                            }
                        }];}
                        break;
                    case 'stop-pre':
                        if (qr['$and']) {
                            qr['$and'].push({
                                'date.stop-pre': {
                                    $gte: start,
                                    $lte: end
                                }
                            })
                        } else {qr['$and'] = [{
                            'date.stop-pre': {
                                $gte: start,
                                $lte: end
                            }
                        }];}
                        break;
                    case 'gzp-build':
                        if (qr['$and']) {
                            qr['$and'].push({
                                $or: [
                                    {
                                        'date.gzp-build': {
                                            $gte: start,
                                            $lte: end
                                        }
                                    },
                                    {
                                        'date.install-devices': {
                                            $gte: start,
                                            $lte: end
                                        }
                                    }
                                ]
                            })
                        } else {qr['$and'] = [{
                            $or: [
                                {
                                    'date.gzp-build': {
                                        $gte: start,
                                        $lte: end
                                    }
                                },
                                {
                                    'date.install-devices': {
                                        $gte: start,
                                        $lte: end
                                    }
                                }
                            ]
                        }];}
                        break;
                    case 'stop-build':
                        if (qr['$and']) {
                            qr['$and'].push({
                                'date.stop-build': {
                                    $gte: start,
                                    $lte: end
                                }
                            })
                        } else {qr['$and'] = [{
                            'date.stop-build': {
                                $gte: start,
                                $lte: end
                            }
                        }];}
                        break;
                    case 'sks-build':
                        if (qr['$and']) {
                            qr['$and'].push({
                                'date.sks-build': {
                                    $gte: start,
                                    $lte: end
                                }
                            })
                        } else {qr['$and'] = [{
                            'date.sks-build': {
                                $gte: start,
                                $lte: end
                            }
                        }];}
                        break;
                    case 'report':
                        if (qr['$and']) {
                            qr['$and'].push({
                                $or: [
                                    { 'date.network': { $gte: start, $lte: end } }
                                ]
                            })
                        } else {qr['$and'] = [{
                            $or: [
                                { 'date.network': { $gte: start, $lte: end } }
                            ]
                        }];}
                        break;
                    case 'succes':
                        if (qr['$and']) {
                            qr['$and'].push({
                                $or: [
                                    {
                                        'date.succes': {
                                            $gte: start,
                                            $lte: end
                                        }
                                    },
                                    {
                                        'date.client-notify': {
                                            $gte: start,
                                            $lte: end
                                        }
                                    }
                                ]
                            })
                        } else {qr['$and'] = [{
                            $or: [
                                {
                                    'date.succes': {
                                        $gte: start,
                                        $lte: end
                                    }
                                },
                                {
                                    'date.client-notify': {
                                        $gte: start,
                                        $lte: end
                                    }
                                }
                            ]
                        }];}
                        break;
                }
            }
        }
        return qr;
    },

    getEndGzpDeadline: async (order) => {
        const isGZP = order.date['gzp-build'] || order.date['install-devices'];
        if (isGZP && order.date['client-match']) {
            var plan = await calculate(order.gzp.time, order.date['client-match']);
            var cs = Math.round((isGZP - plan) / 1000 / 60 / 60 / 24);
            if (cs <= 0) return '-';
            else return '' + cs;
        } else return '-';
    },

    getRespDep: async (order) => {
        switch (order.status) {
            case 'gzp-pre':
            case 'gzp-build':
            case 'install-devices':
                var dep = await Department.findOne({ cities: order.info.city }).lean();
                if (order.special) dep = await Department.findOne({ _id: order.special }).lean();
                return dep;
                break;
            case 'stop-pre':
            case 'stop-build':
                var dep = await Department.findOne({ type: 'b2o' }).lean();
                return dep;
                break;
            case 'all-pre':
                var deps = [
                    await Department.findOne({ type: 'b2o' }).lean(),
                    await Department.findOne({ cities: order.info.city }).lean()
                ];
                if (order.special) deps[1] = await Department.findOne({ _id: order.special }).lean();
                return deps;
                break;
            case 'network':
                var dep = await Department.findOne({ type: 'net' }).lean();
                return dep;
                break;
            case 'client-match':
            case 'client-notify':
                return await Department.findOne({ _id: order.info.initiator.department }).lean();
                break;
            default:
                return '';
                break;
        }
    },

    getGUSName: async (order) => {
        var dep = await Department.findOne({ cities: order.info.city._id });
        if (order.special) dep = await Department.findOne({ _id: order.special });
        if (!dep) return 'Ответственный отдел не определён!';
        return dep.name;
    },

    getRespDepName: async (order) => {
        switch (order.status) {
            case 'gzp-pre':
            case 'gzp-build':
            case 'install-devices':
            case 'build-shutdown':
                var dep;
                if (order.special) {
                    dep = await Department.findOne({ _id: order.special });
                } else {
                    if (order.info.service == 'rrl') {
                        dep = await Department.findOne({ type: 'rrl' });
                    } else {
                        dep = await Department.findOne({ cities: order.info.city._id });
                    }
                }
                if (!dep) return 'Ответственный отдел не определён!'
                return dep.name;
                break;
            case 'stop-pre':
            case 'stop-pause':
            case 'stop-build':
            case 'stop-shutdown':
            case 'stop-continue':
            case 'stop-change':
                var dep = await Department.findOne({ type: 'b2o' });
                if (!dep) {dep = {
                    name: 'Ответсвенный отдел не определён!'
                }}
                return dep.name;
                break;
            case 'all-pre':
                var dep1 = await Department.findOne({ type: 'b2o' });
                var dep2 = await Department.findOne({ cities: order.info.city._id });
                if (order.special) dep2 = await Department.findOne({ _id: order.special });
                if (!dep2) return `${dep1.name}`;
                else return `${dep1.name} и ${dep2.name}`;
                break;
            case 'network':
            case 'pre-shutdown':
            case 'pre-pause':
            case 'pre-continue':
            case 'pre-change':
                var dep = await Department.findOne({ type: 'net' });
                return dep.name;
                break;
            case 'sks-pre':
            case 'sks-build':
                var dep = await Department.findOne({ type: 'sks' });
                if (!dep) {dep = {
                    name: 'Ответсвенный отдел не определён!'
                }}
                return dep.name;
                break;
            case 'client-match':
            case 'client-notify':
            case 'continue':
            case 'change':
                return order.info.initiator.department.name;
                break;
            default:
                return '';
                break;
        }
    },

    calculateDeadline: async (time) => {
        var now = new Date();

        var i = 0;

        while (time > 0) {
            var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            var holi = await Holiday.findOne({ date: day });

            if (day.getDay() != 6 && day.getDay() != 0 && holi == null) {
                time--;
            }
            i++;
        }
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 0, 0, 0, 0);
    },

    parseClient: (str) => {
        var res = { type: '', name: '' };
        for (var i = 1; i < str.length; i++) {
            if (str[i] === ']') {
                res.name = str.slice(i + 2, str.length);
                return res;
            } else res.type += '' + str[i];
        }
        return 'err';
    },

    parserCity: (str) => {
        var res = { type: '', name: '' };
        var types = ['г.', 'с.', 'пгт.', 'пос.'];

        for (var i = 0; i < str.length; i++) {
            if (str[i] === '.') {
                res.type += '.';
                res.name = str.slice(i + 2, str.length);
                if (res.name.length <= 0 || types.indexOf(res.type) < 0) {
                    return 'err';
                }
                return res;
            } else res.type += '' + str[i];
        }
        return 'err';
    },

    parserStreet: (str) => {
        var res = { type: '', name: '' };
        var types = ['ул.', 'пер.', 'кв.', 'бул.', 'наб.', 'пл.', 'пр-т.', 'ш.'];

        for (var i = 0; i < str.length; i++) {
            if (str[i] === '.') {
                res.type += '.';
                res.name = str.slice(i + 2, str.length);
                if (res.name.length <= 0 || types.indexOf(res.type) < 0) {
                    return 'err';
                }
                return res;
            } else res.type += '' + str[i];
        }
        return 'err';
    },

    getData: async (res) => {
        var clients = await Client.find().populate('type');
        var providers = await Provider.find();

        var manDeps = await Department.find({ $or: [{ type: 'b2b' }, { type: 'b2o' }] });

        var managers = await Account.find({ department: manDeps });

        managers = managers.map(i => {
            return {
                text: i.name,
                val: i.login
            }
        });

        var cities = await City.find();
        var streets = await Street.find();
        var _flags = await Flag.find({ user: res.locals.__user._id });
        var deps = await Department.find({
            $and: [
                { type: { $ne: 'admin' } },
                { type: { $ne: 'man' } }
            ]
        }).lean();

        var services = common.services;
        var stages = common.stages;
        var { types } = common.types;


        var flags = {};
        for (var i = 0; i < _flags.length; i++) {
            flags[_flags[i].order] = _flags[i].value;
        }

        clients = clients.map(i => `${i.name}`);

        providers = providers.map(i => `[${i.type}] ${i.name}`);

        cities = cities.map(i => `${i.type} ${i.name}`);
        streets = streets.map(i => `${i.type} ${i.name}`);

        var pre = [
            {
                text: 'только ГЗП',
                val: 'gzp-pre'
            },
            {
                text: 'только СТОП/VSAT',
                val: 'stop-pre'
            },
            {
                text: 'Одновременно ГЗП и СТОП/VSAT',
                val: 'all-pre'
            }
        ];

        return {
            clients: clients,
            providers: providers,
            managers: managers,
            cities: cities,
            streets: streets,
            services: services,
            stages: stages,
            types: types,
            deps: deps,
            flags: flags,
            pre: pre
        }
    }
};

function strToDate(date) {
    if (date) {
        date = date.split('.');
        if (date.length == 3) {
            if (date[1] >= 1 && date[1] <= 12 && date[0] > 0 && date[0] <= 31)
                {return new Date(date[2], date[1] - 1, date[0]);}
            else return false
        } else return false;
    } else return null;
}

function findStageDate(order, stage) {
    var history = order.history,
        res;

    for (var i = 0; i < history.length; i++) {
        if (his[stage] == history[i].name && history[i].author) res = history[i].date;
    }

    return res;
}

var calculate = async (time, now) => {
    var i = 0;

    while (time > 0) {
        var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        var holi = await Holiday.findOne({ date: day });

        if (day.getDay() != 6 && day.getDay() != 0 && holi == null) {
            time--;
        }
        i++;
    }
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 0, 0, 0, 0);
}