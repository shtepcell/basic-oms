
/* global describe it*/
const assert = require('assert');
const { parseDate } = require('../server/controllers/helper');

const validDate = '23.12.2019';
const bigDayDate = '35.12.2019';
const bigMounthDate = '23.13.2019';
const invalidDate = 'qweqwe';
const NOOP = undefined;

describe('Helper', function () {
    describe('parseDate', function () {
        it('Базовая проверка', function () {
            const result = parseDate(validDate);
            const date = new Date(2019, 11, 23).toString();

            assert.equal(result.toString(), date);
        });

        it('Слишком большой день', function () {
            const result = parseDate(bigDayDate);

            assert.equal(result, false);
        });

        it('Слишком большой месяц', function () {
            const result = parseDate(bigMounthDate);

            assert.equal(result, false);
        });

        it('Невалидная дата', function () {
            const result = parseDate(invalidDate);

            assert.equal(result, false);
        });

        it('Пустая дата', function () {
            const result = parseDate(NOOP);

            assert.equal(result, false);
        });
    });
});