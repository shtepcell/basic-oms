const Order = require('../models/Order');
const Department = require('../models/Department');
const Account = require('../models/Account');
const Client = require('../models/Client');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const City = require('../models/City');
const Street = require('../models/Street');
const Holiday = require('../models/Holiday');
const Notify = require('../models/Notify');

module.exports = {


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

    makeQuery: async  (req, res) => {
       var qr = {};
       var query = req.query;
       var status = [];
       if(query.id) {
           return {id: query.id};
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
       }

       if(query.final) {
           if(query.final.indexOf('1') >= 0) {
               status.push({ '$and' : [
                   {status: 'succes'},
                   {'date.gzp-build': {$ne:null}}
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
           var rgx =  new RegExp('' + clnt + '', 'i');
           clnt = await Client.find({name: {$regex: rgx}});
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

       if(query.service) {
           if(qr['$and']) {
               qr['$and'].push({'info.service': query.service})
           } else qr['$and'] = [{'info.service': query.service}];
       }
       return qr;
   },

    getRespDep : async (order) => {
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
           default:
               return order.info.initiator.department.name;
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
       var types = ['ул.', 'пер.', 'кв.', 'пл.', 'пр-т.', 'ш.'];

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

   getData: async () => {
       var clients = await Client.find().populate('type');
       var providers = await Provider.find();
       var cities = await City.find();
       var streets = await Street.find();
       var services = await Service.find();


       clients = clients.map( i => `${i.name}`);

       providers = providers.map( i => `[${i.type}] ${i.name}`);

       cities = cities.map( i => `${i.type} ${i.name}`);
       streets = streets.map( i => `${i.type} ${i.name}`);


       services = services.map( i => {
           return {
               val: `${i._id}`,
               text: `${i.name}`
           }
       });

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
           pre: pre
       }
   }
};
