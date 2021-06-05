'use strict';

const _ = require('lodash');
const services = require('../common-data/services');
const xl = require('excel4node');

function get(order, field) {
    var fields = {
        'id': {
            text: 'ID',
            value: () => _.get(order, 'id')
        },
        'date-init': {
            text: 'Дата инициации',
            value: () => _.get(order, 'date.init')
        },
        'initiator': {
            text: 'Инициатор',
            value: () => _.get(order, 'info.initiator.name')
        },
        'date-on': {
            text: 'Дата включения',
            value: () => _.get(order, 'date.client-notify')
        },
        'date-start': {
            text: 'Дата начала организации',
            value: () => _.get(order, 'date.client-match')
        },
        'date-plan': {
            text: 'Плановая дата организации',
            value: () => _.get(order, 'date.cs-gzp-organization')
        },
        'date-end': {
            text: 'Дата активации',
            value: () => {
                const isShortPath = _.get(order, 'info.client.shortName') == 'SOHO' ||
                    _.get(order, 'info.service') === "sks" ||
                    _.get(order, 'info.service') === "devices" ||
                    _.get(order, 'info.service') === "rrl";

                if (isShortPath) {
                    return _.get(order, 'date.install-devices');
                }

                return _.get(order, 'date.network')
            }
        },
        'cms': {
            text: 'Номер СMS',
            value: () => _.get(order, 'info.cms')
        },
        'status': {
            text: 'Статус',
            value: () => _.get(order, 'status')
        },
        'pause-time': {
            text: 'Длительность пауз',
            value: () => _.get(order, 'pauseTime')
        },
        'cs': {
            text: 'КС',
            value: () => _.get(order, 'cs')
        },
        'department': {
            text: 'Ответсвенный ГУС',
            value: () => _.get(order, 'gusName')
        },
        'gzpDeadline': {
            text: 'Просрочка организации',
            value: () => _.get(order, 'prosrochka')
        },
        'client': {
            text: 'Клиент',
            value: () => _.get(order, 'info.client.name')
        },
        'client-type': {
            text: 'Тип клиента',
            value: () => _.get(order, 'info.client.type.name')
        },
        'typeOfClient': {
            text: 'Тип клиента (в заказе)',
            value: () => _.get(order, 'info.clientType')
        },
        'city': {
            text: 'Город',
            value: () => `${_.get(order, 'info.city.type')} ${_.get(order, 'info.city.name')}`
        },
        'street': {
            text: 'Улица',
            value: () => {
                return order.info.street ?
                    `${order.info.street.type} ${order.info.street.name}`:
                    'улица не указана';
            }
        },
        'adds': {
            text: 'д./кв. и т.д',
            value: () => _.get(order, 'info.adds')
        },
        'coordinate': {
            text: 'Координаты',
            value: () => _.get(order, 'info.coordinate')
        },
        'service': {
            text: 'Услуга',
            value: () => services[_.get(order, 'info.service')] || ''
        },
        'volume': {
            text: 'Ёмкость',
            value: () => _.get(order, 'info.volume')
        },
        'relation': {
            text: 'Связанные заказы',
            value: () => _.get(order, 'info.relation')
        },
        'ip': {
            text: 'Количество IP адресов',
            value: () => _.get(order, 'info.ip')
        },
        'init-add-info': {
            text: 'Дополнительная информация',
            value: () => _.get(order, 'info.add_info')
        },
        'income-once': {
            text: 'Ожидаемый единовр. доход (руб)',
            value: () => _.get(order, 'info.income-once')
        },
        'income-monthly': {
            text: 'Ожидаемый ежемес. доход (руб)',
            value: () => _.get(order, 'info.income-monthly')
        },
        'gzp-need': {
            text: 'Необходимость ГЗП',
            value: () => _.get(order, 'gzp.need')
        },
        'gzp-capability': {
            text: 'Техническая возможность ГЗП',
            value: () => _.get(order, 'gzp.capability')
        },
        'gzp-time': {
            text: 'Срок организации',
            value: () => _.get(order, 'gzp.time')
        },
        'gzp-cost-once': {
            text: 'Единоразовая стоимость организации',
            value: () => _.get(order, 'gzp.cost-once')
        },
        'gzp-cost-monthly': {
            text: 'Операционные затраты ежемесячные',
            value: () => _.get(order, 'gzp.cost-monthly')
        },
        'gzp-add-info': {
            text: 'Дополнительная информация',
            value: () => _.get(order, 'gzp.add_info')
        },
        'gzp-reason': {
            text: 'Причина технической невозможности',
            value: () => _.get(order, 'gzp.reason')
        },
        'stop-capability': {
            text: 'Техническая возможность СТОП',
            value: () => _.get(order, 'stop.capability')
        },
        'stop-provider': {
            text: 'Провайдер',
            value: () => _.get(order, 'stop.provider.name')
        },
        'stop-contact': {
            text: 'Контакт с провайдером',
            value: () => _.get(order, 'stop.contact')
        },
        'stop-devices': {
            text: 'Оборудование',
            value: () => _.get(order, 'stop.devices')
        },
        'stop-add-devices': {
            text: 'Дополнительное оборудование',
            value: () => _.get(order, 'stop.add_devices')
        },
        'stop-interfaces': {
            text: 'Интерфейсы',
            value: () => _.get(order, 'stop.interfaces')
        },
        'stop-time': {
            text: 'Срок организации СТОП',
            value: () => _.get(order, 'stop.time')
        },
        'stop-add-info': {
            text: 'Дополнительная информация',
            value: () => _.get(order, 'stop.add_info')
        },
        'stop-org-info': {
            text: 'Информация об организации',
            value: () => _.get(order, 'stop.organization_info')
        },
        'stop-cost-once': {
            text: 'Единоразовая стоимость организации СТОП',
            value: () => _.get(order, 'stop.cost-once')
        },
        'stop-cost-monthly': {
            text: 'Операционные затраты ежемесячные СТОП',
            value: () => _.get(order, 'stop.cost-monthly')
        }
    };

    return fields[field];
}

var def = ['id', 'date-init', 'initiator', 'date-on', 'date-end', 'cms', 'status', 'cs', 'department', 'typeOfClient',
    'client', 'client-type', 'city', 'street', 'adds',
    'coordinate', 'service', 'volume', 'relation', 'ip',
    'init-add-info', 'income-once', 'income-monthly',
    'gzp-need', 'gzp-capability', 'gzp-time', 'gzp-cost-once',
    'gzp-cost-monthly', 'gzp-add-info', 'gzp-reason',
    'stop-capability', 'stop-provider', 'stop-contact',
    'stop-devices', 'stop-add-devices', 'stop-interfaces',
    'stop-time', 'stop-add-info', 'stop-org-info',
    'stop-cost-once', 'stop-cost-monthly'];

var reportDefs = ['id', 'date-start', 'date-plan', 'date-end', 'gzpDeadline', 'pause-time', 'status', 'department',
    'client', 'city', 'street', 'adds'];

module.exports = {

    getExcel: async (orders, res) => {
        var wb = new xl.Workbook({
            dateFormat: 'dd/mm/yyyy'
        });

        var ws = wb.addWorksheet('Таблица 1');

        def.forEach((col, j) => {
            ws.cell(1, j + 1).string(get(null, col).text)
        });

        orders.forEach((item, i) => {

            def.forEach((col, j) => {
                var val = null;
                val = get(item, col).value();
                if (val == null) ws.cell(i + 2, j + 1).string('');
                else {
                    switch (def[j]) {
                        case 'date-init':
                        case 'date-on':
                        case 'date-end':
                            ws.cell(i + 2, j + 1).date(val);
                            break;
                        default:
                            ws.cell(i + 2, j + 1).string(val.toString());
                            break;
                    }
                }
            })
        });

        wb.write('Export.xlsx', res);
    },

    getReportExcel: async (orders, res) => {
        var wb = new xl.Workbook({
            dateFormat: 'dd/mm/yyyy'
        });

        var ws = wb.addWorksheet('Таблица 1');

        reportDefs.forEach((col, j) => {
            ws.cell(1, j + 1).string(get(null, col).text)
        });

        orders.forEach((item, i) => {

            reportDefs.forEach((col, j) => {
                var val = null;
                val = get(item, col).value();
                if (val == null) ws.cell(i + 2, j + 1).string('');
                else {
                    switch (reportDefs[j]) {
                        case 'date-init':
                        case 'date-on':
                        case 'date-start':
                        case 'date-plan':
                        case 'date-end':
                            ws.cell(i + 2, j + 1).date(val);
                            break;
                        default:
                            ws.cell(i + 2, j + 1).string(val.toString());
                            break;
                    }
                }
            })
        });

        return wb.write('Report.xlsx', res);
    }
};
