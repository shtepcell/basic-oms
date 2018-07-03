const Order = require('../models/Order');
const Department = require('../models/Department');
const Account = require('../models/Account');
const Client = require('../models/Client');
const Provider = require('../models/Provider');
const City = require('../models/City');
const Street = require('../models/Street');
const Holiday = require('../models/Holiday');
const Notify = require('../models/Notify');
const Flag = require('../models/Flag');

const common = require('../common-data');

module.exports = {

    trimObject: function (obj) {
        Object.keys(obj).forEach( i => {
            try {
                obj[i] = obj[i].trim();
            } catch(err) { console.log('Cannot trim field') }
        })
        return obj;
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
            case 'client-match':
                ret.name = 'Согласование с клиентом';
                break;
            case 'redirect':
                ret.name = `Зона ответсвенности изменена -> ${opt.department}`;
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
        if(order.pause && order.pause.status) {
            pause = order.pause.date;
            pause = Math.round((now - pause) / 1000 / 60 / 60 / 24) + 1;
        }
        return cs+pause;
    },

    dateToStr: function (value) {
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = value.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        return `${day}.${month}.${year}`;
    },

    dateToExtStr: function (value = new Date()) {
        var hour = value.getHours();
        if(hour < 10) {
            hour = '0' + hour;
        }
        var min = value.getMinutes();
        if(min < 10) {
            min = '0' + min;
        }
        var sec = value.getSeconds();
        if(sec < 10) {
            sec = '0' + sec;
        }
        return `${this.dateToStr(value)} ${hour}:${min}:${sec}`;
    },

    dateToChatStr: function (value = new Date()) {
        var now = new Date().getDate();

        if(now == value.getDate()) {
            var hour = value.getHours();
            if(hour < 10) {
                hour = '0' + hour;
            }
            var min = value.getMinutes();
            if(min < 10) {
                min = '0' + min;
            }
            return `${hour}:${min}`;
        } else {
            return this.dateToStr(value);
        }
    },

    strToDate: strToDate,

    parseDate: (date) => {
        date = date.split('.');
        if(date.length == 3) {
            if(date[1] >= 0 && date[1] <= 11 && date[0] > 0 &&  date[0] <= 31)
                return new Date(date[2], date[1]-1, date[0]);
            else return false
        } else return false;
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
       }

       var paths = path.split('.');

       array.sort( (a, b) => {
           for (var i = 0; i<paths.length; i++) {
               a = a[paths[i]];
               b = b[paths[i]];
           }
           if(path == 'deadline') {
               if(a === null || a === undefined)
                   a = 9999999999999;
               if(b === null || b === undefined)
                   b = 9999999999991;
           }

           if(a < b)
               return -1*reverse;
           if(a > b)
               return 1*reverse;
           return 0;
       });

       return array;
    },

    getZone: async (order) => {
        if(order.special) {
            var dep = await Department.findOne({_id: order.special});
            return dep.name;
        }
        else {
            var dep = await Department.findOne({cities: order.info.city._id});

            if(dep) return dep.name;
            else return 'Неизвестно'
        }
    },

    makeQuery: async  (req, res) => {
        var qr = {status: {$ne: 'secret'}};
        var query = req.query;
        var status = [];
        if(query.id) {
           if(!isNaN(query.id)) {
               return {id: query.id, status: {$ne: 'secret'}};
           }
        }
        if(query.cms) {
           return {cms: query.cms};
        }
        if(query.func) {
           if(query.func.indexOf('1') >= 0) {
               qr['$or'] = [
                   {'info.initiator': res.locals.__user._id},
                   {'history.author': res.locals.__user._id}
               ]
           }
           if(query.func.indexOf('2') >= 0) {
               qr['deadline'] = {'$lte': new Date()};
           }
           if(query.func.indexOf('3') >= 0) {
               qr['pause.status'] = true;
           }
        }

        if(query.resp) {
            var resp;
            try {
                resp = await Department.findOne({_id: query.resp+''});
            } catch(err) { console.log('Cannot find department');}
            var respQ = {};
            if(resp != null)
            switch (resp.type) {
                case 'b2b':
                    respQ = {'info.department': resp._id};
                    break;
                case 'b2o':
                    respQ = { '$or': [
                        {
                            '$or': [
                                {status: 'client-match'},
                                {status: 'client-notify'}

                            ],
                            'info.department': resp._id
                        },
                        {status: 'stop-build'},
                        {status: 'all-pre'},
                        {status: 'stop-pre'}
                    ]}
                    break;
                case 'gus':
                    var cts = resp.cities.map( j => {
                        return {
                            'info.city': j
                        }
                    });
                    respQ = { '$or': cts };
                    break;
                case 'net':
                    respQ = { status: 'network' };
                    break;
                case 'sks':
                    respQ = { '$or':[
                        { status: 'sks-pre' },
                        { status: 'sks-build' }
                    ]};
                    break;
            }

            if(qr['$and']) {
                qr['$and'].push(respQ);
            } else qr['$and'] = [respQ];
        }

        if(query.pre) {
           if(query.pre.indexOf('1') >= 0) {
               status.push({status: 'gzp-pre'});
               status.push({status: 'all-pre'});
           }
           if(query.pre.indexOf('2') >= 0) {
               status.push({status: 'stop-pre'});
               if(status.indexOf({status: 'all-pre'}) < 0) {
                   status.push({status: 'all-pre'});
               }
           }
           if(query.pre.indexOf('3') >= 0) {
               status.push({status: 'client-match'});
           }
           if(query.pre.indexOf('4') >= 0) {
               status.push({status: 'sks-pre'});
           }
        }

        if(query.build) {
           if(query.build.indexOf('1') >= 0) {
               status.push({status: 'gzp-build'});
           }
           if(query.build.indexOf('2') >= 0) {
               status.push({status: 'install-devices'});
           }
           if(query.build.indexOf('3') >= 0) {
               status.push({status: 'stop-build'});
           }
           if(query.build.indexOf('4') >= 0) {
               status.push({status: 'network'});
           }
           if(query.build.indexOf('5') >= 0) {
               status.push({status: 'client-notify'});
           }
           if(query.build.indexOf('6') >= 0) {
               status.push({status: 'sks-build'});
           }
        }

        if(query.final) {
           if(query.final.indexOf('1') >= 0) {
               status.push({ '$and' : [
                   {status: 'succes'},
                   { '$or': [
                       {'date.gzp-build': {$ne: null}},
                       {'date.install-devices': {$ne: null}}
                   ]}
               ]});
           }
           if(query.final.indexOf('2') >= 0) {
               status.push({ '$and' : [
                   {status: 'succes'},
                   {'date.stop-build': {$ne:null} }
               ]});
           }
           if(query.final.indexOf('3') >= 0) {
               status.push({status: 'reject'});
           }
        }

        if(status.length > 0) {
            if(qr['$or']) {
                qr['$or'] = qr['$or'].concat(status);
            } else
                qr['$or'] = status;
        }

        if(query.client) {
            var clnt = query.client;
            clnt = clnt.trim();
            // var rgx =  new RegExp('' + clnt + '', 'i');
            // clnt = await Client.find({name: {$regex: rgx}});
            clnt = await Client.find({name: clnt});

            if(clnt.length > 0) {
               var _q = [];
               clnt.forEach( itm => {
                   _q.push({'info.client': itm._id});
               })
               qr['$and'] = [{'$or': _q}];
            } else {
               qr['$and'] = [{'asdasd': 'asdasdasd'}]
            }
        }

        if(query.city) {
            var city = module.exports.parserCity(query.city);
            city = await City.find({name: city.name, type: city.type});
            if(city.length > 0) {
               var _q = [];
               city.forEach( itm => {
                   _q.push({'info.city': itm._id});
               })
               if(qr['$and']) {
                   qr['$and'].push({'$or': _q})
               } else qr['$and'] = [{'$or': _q}];
            } else {
               qr['$and'] = [{'asdasd': 'asdasdasd'}]
            }
        }

        if(query.street) {
            var _street = module.exports.parserStreet(query.street),
                streetQuery = {'asdasd': 'sadasdas'};

            if(_street == 'err') {
                let rgx = new RegExp('' + query.street + '', 'i');
                streetQuery = {'info.adds': {$regex: rgx}};
            } else {
                street = await Street.findOne({name: _street.name, type: _street.type});

                if(street) {
                    let rgx = new RegExp('' + _street.name + '', 'i');
                    streetQuery = {$or: [
                        {'info.street': street},
                        {'info.adds': {$regex: rgx}}
                    ]}
                } else {
                    let rgx = new RegExp('' + query.street + '', 'i');
                    streetQuery = {'info.adds': {$regex: rgx}};
                }
            }

            if(qr['$and']) {
                qr['$and'].push(streetQuery)
            } else qr['$and'] = [streetQuery];
        }

        if(query.adress) {
            var val = query.adress;
            val = val.replace(/\[/g, '');
            val = val.replace(/\]/g, '');
            val = val.replace(/\\/g, '');
            val = val.replace(/\(/g, '');
            val = val.replace(/\)/g, '');
            var rgx =  new RegExp('' + val + '', 'i');
           if(qr['$and']) {
               qr['$and'].push({'info.adds': {$regex: rgx}})
           } else qr['$and'] = [{'info.adds': {$regex: rgx}}];
        }

        if(query.service) {
           if(qr['$and']) {
               qr['$and'].push({'info.service': query.service})
           } else qr['$and'] = [{'info.service': query.service}];
        }

        if(query['date-status'] && (query['date-start'] != '' || query['date-end'] != '') ) {
            var start,
                end;

            query['date-start'] = query['date-start'].trim();
            query['date-end'] = query['date-end'].trim();

            if(query['date-start'] == '') start = new Date(1990, 1, 1);
            else start = strToDate(query['date-start']);
            if(query['date-end'] == '') end = new Date(2200, 1, 1);
            else end = strToDate(query['date-end']);


            var _status;
            if(query['date-status']) {
                switch (query['date-status']) {
                    case 'init':
                        if(qr['$and']) {
                            qr['$and'].push({'date.init': {
                                $gte: start,
                                $lte: end
                            }})
                        } else qr['$and'] = [{
                            'date.init': {
                                $gte: start,
                                $lte: end
                            }
                        }];
                        break;
                    case 'gzp-pre':
                        if(qr['$and']) {
                            qr['$and'].push({'date.gzp-pre': {
                                $gte: start,
                                $lte: end
                            }})
                        } else qr['$and'] = [{
                            'date.gzp-pre': {
                                $gte: start,
                                $lte: end
                            }
                        }];
                        break;
                    case 'sks-pre':
                        if(qr['$and']) {
                            qr['$and'].push({'date.sks-pre': {
                                $gte: start,
                                $lte: end
                            }})
                        } else qr['$and'] = [{
                            'date.sks-pre': {
                                $gte: start,
                                $lte: end
                            }
                        }];
                        break;
                    case 'stop-pre':
                        if(qr['$and']) {
                            qr['$and'].push({'date.stop-pre': {
                                $gte: start,
                                $lte: end
                            }})
                        } else qr['$and'] = [{
                            'date.stop-pre': {
                                $gte: start,
                                $lte: end
                            }
                        }];
                        break;
                    case 'gzp-build':
                        if(qr['$and']) {
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
                        } else qr['$and'] = [{
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
                            }];
                        break;
                    case 'stop-build':
                        if(qr['$and']) {
                            qr['$and'].push({'date.stop-build': {
                                $gte: start,
                                $lte: end
                            }})
                        } else qr['$and'] = [{
                            'date.stop-build': {
                                $gte: start,
                                $lte: end
                            }
                        }];
                        break;
                    case 'sks-build':
                        if(qr['$and']) {
                            qr['$and'].push({'date.sks-build': {
                                $gte: start,
                                $lte: end
                            }})
                        } else qr['$and'] = [{
                            'date.sks-build': {
                                $gte: start,
                                $lte: end
                            }
                        }];
                        break;
                    case 'succes':
                        if(qr['$and']) {
                            qr['$and'].push({'date.succes': {
                                $gte: start,
                                $lte: end
                            }})
                        } else qr['$and'] = [{
                            'date.succes': {
                                $gte: start,
                                $lte: end
                            }
                        }];
                        break;
                }
            }
        }
        return qr;
    },

    getRespDep : async (order) => {
       switch (order.status) {
           case 'gzp-pre':
           case 'gzp-build':
           case 'install-devices':
               var dep = await Department.findOne({cities: order.info.city}).lean();
               return dep;
               break;
           case 'stop-pre':
           case 'stop-build':
               var dep = await Department.findOne({type: 'b2o'}).lean();
               return dep;
               break;
           case 'all-pre':
               var deps = [
                   await Department.findOne({type: 'b2o'}).lean(),
                   await Department.findOne({cities: order.info.city}).lean()
               ];
              return deps;
              break;
           case 'network':
               var dep = await Department.findOne({type: 'net'}).lean();
               return dep;
               break;
           case 'client-match':
           case 'client-notify':
               return await Department.findOne({_id: order.info.initiator.department}).lean();
               break;
           default:
               return null;
               break;
       }
   },

   getRespDepName : async (order) => {
      switch (order.status) {
          case 'gzp-pre':
          case 'gzp-build':
          case 'install-devices':
              var dep = await Department.findOne({cities: order.info.city._id});
              // if(!dep) dep = await Department.findOne({type: 'b2o'});
              if(!dep) return 'Ответственный отдел не определён!'
              return dep.name;
              break;
          case 'stop-pre':
          case 'stop-build':
              var dep = await Department.findOne({type: 'b2o'});
              if(!dep) dep = {
                  name: 'Ответсвенный отдел не определён!'
              }
              return dep.name;
              break;
          case 'all-pre':
              var dep1 = await Department.findOne({type: 'b2o'});
              var dep2 = await Department.findOne({cities: order.info.city._id});
              if(!dep2) return `${dep1.name}`;
              else return `${dep1.name} и ${dep2.name}`;
              break;
          case 'network':
              var dep = await Department.findOne({type: 'net'});
              return dep.name;
              break;
          case 'sks-pre':
          case 'sks-build':
              var dep = await Department.findOne({type: 'sks'});
              if(!dep) dep = {
                  name: 'Ответсвенный отдел не определён!'
              }
              return dep.name;
              break;
          case 'client-match':
          case 'client-notify':
              return order.info.initiator.department.name;
              break;
          default:
              return null;
              break;
      }
  },

   calculateDeadline: async (time) => {
       var holidays = await Holiday.find();
       var now = new Date();

       var i = 0;

       while (time > 0) {
           var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
           var holi = await Holiday.findOne({date: day});

           if(day.getDay() != 6 && day.getDay() != 0 && holi == null) {
               time--;
           }
           i++;
       }
       return new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 0, 0, 0, 0);
   },

    parseClient: (str) => {
       var res = { type: '', name: ''};
       for (var i = 1; i < str.length; i++) {
           if(str[i] === ']') {
               res.name = str.slice(i+2, str.length);
               return res;
           } else res.type += ''+str[i];
       }
       return 'err';
    },

    parserCity: (str) =>  {
       var res = { type: '', name: ''};
       var types = ['г.', 'с.', 'пгт.', 'пос.'];

       for (var i = 0; i < str.length; i++) {
           if(str[i] === '.') {
               res.type += '.';
               res.name = str.slice(i+2, str.length);
               if (res.name.length <= 0 || types.indexOf(res.type) < 0) {
                   return 'err';
               }
               return res;
           } else res.type += ''+str[i];
       }
       return 'err';
    },

    parserStreet: (str) => {
       var res = { type: '', name: ''};
       var types = ['ул.', 'пер.', 'кв.', 'бул.', 'наб.', 'пл.', 'пр-т.', 'ш.'];

       for (var i = 0; i < str.length; i++) {
           if(str[i] === '.') {
               res.type += '.';
               res.name = str.slice(i+2, str.length);
               if (res.name.length <= 0 || types.indexOf(res.type) < 0) {
                   return 'err';
               }
               return res;
           } else res.type += ''+str[i];
       }
       return 'err';
    },

    parseDate: (date) => {
       date = date.split('.');
       if(date.length == 3) {
           if(date[1] >= 0 && date[1] <= 11 && date[0] > 0 &&  date[0] <= 31)
               return new Date(date[2], date[1]-1, date[0]);
           else return false
       } else return false;
   },

   getData: async (res) => {
       var clients = await Client.find().populate('type');
       var providers = await Provider.find();
       var cities = await City.find();
       var streets = await Street.find();
       var _flags = await Flag.find({user: res.locals.__user._id});
       var deps = await Department.find({
           $and: [
               {type: {$ne: 'admin'}},
               {type: {$ne: 'man'}}
           ]
       }).lean();

       var services = common.services;
       var stages = common.stages;

       var flags = {};
       for (var i = 0; i < _flags.length; i++) {
           flags[_flags[i].order] = _flags[i].value;
       }

       clients = clients.map( i => `${i.name}`);

       providers = providers.map( i => `[${i.type}] ${i.name}`);

       cities = cities.map( i => `${i.type} ${i.name}`);
       streets = streets.map( i => `${i.type} ${i.name}`);

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
           cities: cities,
           streets: streets,
           services: services,
           stages: stages,
           deps: deps,
           flags: flags,
           pre: pre
       }
   }
};

function strToDate(date) {
    if(date) {
        date = date.split('.');
        if(date.length == 3) {
            if(date[1] >= 0 && date[1] <= 11 && date[0] > 0 &&  date[0] <= 31)
                return new Date(date[2], date[1]-1, date[0]);
            else return false
        } else return false;
    } else return null;
}
