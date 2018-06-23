'use strict';
const nodemailer = require('nodemailer'),
    logger = require('./logger'),
    { notifies } = require('../common-data');


var transporter = nodemailer.createTransport({
    host: 'relay1.miranda-media.ru',
    port: 25,
    secure: false
});

var subject = '<h2>СУЗ | Новое уведомление</h2>';
var footer = '<br><br><span style="color:#000;font-size:12pt">'+
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

    var header = `СУЗ | Новое уведомление`;
    if(type == 'new-message')
        header = `СУЗ | Вас упомянули в чате заказа ${order.id}`;
    else
        header = `СУЗ | Статус заказа ${order.id}`;

    mailOptions.subject = subject;


    mailOptions.html = header + `<p style="font-size: 14pt;"><a href="http://ops-test.miranda-media.ru/order/${order.id}">` +
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
