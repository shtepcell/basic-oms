/* global describe it*/
const assert = require('assert');
const { getRecipients } = require('../server/controllers/mailer');

const users = [
    { settings: { sendEmail: false }, email: 'some1@ya.ru' },
    { settings: { sendEmail: true } },
    { settings: { sendEmail: true }, email: 'some@yandex.ru' },
    { settings: { sendEmail: true }, email: 'some@mail.ru' }
];

const dublesUsers = [
    { settings: { sendEmail: true }, email: 'some@yandex.ru' },
    { settings: { sendEmail: true }, email: 'some@yandex.ru' },
    { settings: { sendEmail: true }, email: 'some@yandex.ru' }
];

describe('Mailer', function () {
    describe('sendEmail', function () {
        it('Базовая проверка', function () {
            const result = getRecipients(users);

            assert.equal(result, 'some@yandex.ru,some@mail.ru');
        });

        it('Не должно отправить email', function () {
            const result = getRecipients(users.slice(0, 2));

            assert.equal(result, '');
        });

        it('Не должно быть дубликатов', function () {
            const result = getRecipients(dublesUsers);

            assert.equal(result, 'some@yandex.ru');
        });
    });
});