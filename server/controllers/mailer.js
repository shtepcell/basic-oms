'use strict';
const nodemailer = require('nodemailer');
const { notifies } = require('../common-data');

const { NODE_ENV, MAILER_HOST, PROJECT_HOST, DOMAIN_HOST } = process.env;
const isDev = NODE_ENV === 'development';

const transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: 25,
    secure: false
});

const subject = 'СУЗ | Новое уведомление';
const footer = '<br><br><span style="color:#000;font-size:10pt">'+
    '<p>Это письмо сформировано автоматически службой уведомлений '+
    'Системы управления заказами. Отвечать на него не нужно.</p>'+
    '<p>Если вы получаете эти письма по ошибке, обратитесь к администратору системы</p>'+
    '</span>';

function getRecipients(recipients) {
    const to = [];

    for (let i = 0; i < recipients.length; i++) {
        const { settings: { sendEmail }, email} = recipients[i];
        const canSend = sendEmail && email;

        canSend && !to.includes(email) && to.push(email);
    }

    return to.join(',');
}

module.exports = {
    getRecipients,

    sendMail(order, recipients, type) {
        const mailOptions = {
            from: `ops@${DOMAIN_HOST}`
        }

        const to = getRecipients(recipients);

        if (!to) {
            console.log('Mailer: No recipients found');

            return;
        }

        mailOptions.to = to;

        let header = `<h2>СУЗ | Новое уведомление</h2>`;

        switch (type) {
            case 'new-message':
                header = `<h2>СУЗ | Вас упомянули в чате заказа ${order.id}</h2>`;
                break;

            case 'change-params':
                header = `<h2>СУЗ | Обновление услуги или параметров услуги в заказе #${order.id}</h2>`;
                break;

            default:
                header = `<h2>СУЗ | Статус заказа #${order.id}</h2>`;
                break;
        }

        mailOptions.subject = subject;

        mailOptions.html = header + `<p style="font-size: 12pt;"><a href="http://${PROJECT_HOST}/order/${order.id}">` +
            `Заказ #${order.id} от [${order.info.client.type.shortName}] ${order.info.client.name}</a> - "${notifies[type]}"</p>` +
            footer

        console.log('Mailer: Send mail to: ', to);

        if (isDev) {
            return;
        }

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Mailer Error: ', error);
            }
        })
    }
}