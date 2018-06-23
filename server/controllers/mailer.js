'use strict';
const nodemailer = require('nodemailer'),
    logger = require('./logger'),
    { notifies } = require('../common-data');


var transporter = nodemailer.createTransport({
    host: 'relay1.miranda-media.ru',
    port: 25,
    secure: false
});

var header = '<h2>СУЗ | Новое уведомление</h2>';
var footer = '<br><br><span style="color:#000;font-size:80%">'+
    '<p>Это письмо сформировано автоматически службой уведомлений '+
    'Системы управления заказами. Отвечать на него не нужно.</p>'+
    '<p>Если вы получаете эти письма по ошибке, обратитесь к администратору системы</p>'+
    '</span>';


module.exports.sendMail = (order, recipients, type) => {
    var mailOptions = {
        from: 'ops@miranda-media.ru'
    }

    var to = [];

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

    mailOptions.subject = `СУЗ | Статус заказа ${order.id}`

    mailOptions.html = header + `<p><a href="ops-test.miranda-media.ru/order/${order.id}">` +
		`Заказ ${order.id} от [${order.info.client.type.shortName}] ${order.info.client.name}</a> - "${notifies[type]}"</p>` +
		footer

    if (process.env.NODE_ENV != 'development')
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error);
            }
        })
    console.log('Send mail to', rps);
}
