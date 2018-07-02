'use strict';
const nodemailer = require('nodemailer'),
    logger = require('./logger'),
    { notifies } = require('../common-data');


var transporter = nodemailer.createTransport({
    host: 'relay1.miranda-media.ru',
    port: 25,
    secure: false
});

var subject = 'СУЗ | Новое уведомление';
var footer = '<br><br><span style="color:#000;font-size:10pt">'+
    '<p>Это письмо сформировано автоматически службой уведомлений '+
    'Системы управления заказами. Отвечать на него не нужно.</p>'+
    '<p>Если вы получаете эти письма по ошибке, обратитесь к администратору системы</p>'+
    '</span>';


module.exports.sendMail = (order, recipients, type) => {
    var mailOptions = {
        from: 'ops@miranda-media.ru'
    }

    var to = [];
    
    if(recipients.length > 0) {

        for (var i = 0; i < recipients.length; i++) {
            if(recipients[i].settings.sendEmail && recipients[i].email) {
                to.push(recipients[i].email);
            }
        }

        var rps = '';

        for (var i = 0; i < to.length; i++) {
            var last = (i+1 == to.length);

            rps += to[i];

            if(!last) rps += ',';
        }

        mailOptions.to = rps;

        var header = `<h2>СУЗ | Новое уведомление</h2>`;
        if(type == 'new-message')
            header = `<h2>СУЗ | Вас упомянули в чате заказа ${order.id}</h2>`;
        else
            header = `<h2>СУЗ | Статус заказа #${order.id}</h2>`;

        mailOptions.subject = subject;

        mailOptions.html = header + `<p style="font-size: 12pt;"><a href="http://ops.miranda-media.ru/order/${order.id}">` +
    		`Заказ #${order.id} от [${order.info.client.type.shortName}] ${order.info.client.name}</a> - "${notifies[type]}"</p>` +
    		footer

        if (process.env.NODE_ENV != 'development')
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    console.log(error);
                }
            })
        console.log('Send mail to', rps);
    }
}
