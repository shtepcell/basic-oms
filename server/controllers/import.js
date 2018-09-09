'use strict';

var xl = require('excel4node');
const Client = require('../models/Client');
const City = require('../models/City');
const Street = require('../models/Street');

const { render } = require('../render');

module.exports = {

    getHandbook: async (req, res) => {

        // var wb = new xl.Workbook({
        //   dateFormat: 'dd/mm/yyyy'
        // });

        // var ws = wb.addWorksheet('Справочники');

        // ws.cell(1, 1).string('Город');

        // wb.write('Handbook.xlsx', res);
        console.log('asdasd');
        
        res.send(200);
    },

    getPage: async (req, res) => {

      render(req, res, {
          viewName: 'orders/multi-init'
      });
    }
}
