'use strict';
const nodemailer = require('nodemailer');
const logger = require('./logger');

var transporter = nodemailer.createTransport({
    host: 'relay1.miranda-media.ru',
    port: 25,
    secure: false
});

var header = '<h2>Сообщение Системы управления заявками</h2>'
var footer = '<br><br><span style="color:#000;font-size:80%">'+
    '<p>Это письмо сформировано автоматически службой уведомлений '+
    'Системы управления заказами. Отвечать на него не нужно.</p>'+
    '<p>Если вы получаете эти письма по ошибке, обратитесь к администратору системы</p>'+
    '</span>';

var stages = {
    'init': 'Инициация заказа',
    'client-match': 'Согласование с клиентом',
    'client-notify': 'Уведомление клиента',
    'all-pre': 'Проработка по ГЗП и STOP/VSAT',
    'gzp-pre': 'Проработка по ГЗП',
    'gzp-build': 'Организация ГЗП',
    'install-devices': 'Установка оборудования',
    'stop-pre': 'Проработка по STOP/VSAT',
    'stop-build': 'Организация STOP/VSAT',
    'network': 'Настройка сети',
    'succes': 'Включен',
    'reject': 'Заявка отклонена',
    'secret': 'Заявка удалена'
};
module.exports.sendMail = (order, type) => {
    var mailOptions = {
        from: 'ops@miranda-media.ru'
    }

    var boxes = [];
    order.history.forEach( item => {
        if(boxes.indexOf(item.author.email) < 0) {
            if(item.author.settings && item.author.settings.sendEmail)
                boxes.push(item.author.email);
        }
    })

    var to = '';
    for (var i = 0; i < boxes.length; i++) {
        if(i == boxes.length - 1)
            to +=boxes[i];
        else
            to +=boxes[i]+', ';
    }

    mailOptions.to = to;

    switch (type) {
        case 'new-status':
            mailOptions.subject = `СУЗ 2.0: Статус заказа ${order.id}`
            mailOptions.html = header + `<p><a href="ops-test.miranda-media.ru/order/${order.id}">` +
    			`Заявка ${order.id} от [${order.info.client.type.shortName}] ${order.info.client.name}</a> (ops-test.miranda-media.ru/orders/${order.id}) переведена в состояние "${stages[order.status]}"</p>` +
    			footer
            break;
        case 'pause':
            mailOptions.subject = `СУЗ 2.0: Статус заказа ${order.id}`
            mailOptions.html = header + `<p><a href="ops-test.miranda-media.ru/order/${order.id}">` +
    			`Заявка ${order.id} от [${order.info.client.type.shortName}] ${order.info.client.name}</a> (ops-test.miranda-media.ru/orders/${order.id}) поставлена на паузу"</p>` +
    			footer
            break;
    }
    if (process.env.NODE_ENV != 'development')
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error);
            }
        })
    console.log('Send mail to', to);
}
