module.exports = function(opt, data){
    const { services } = data.dataset;

    const access = opt.access;
    
    const srvs = Object.keys(services).map( item => {
        return item;
    })

    const res = [];

    const resAcc = [];

    srvs.forEach( item => {
        resAcc.push({
            tag: 'h3',
            attrs: {
                style: 'margin-left: 30px;'
            },
            content: services[item]
        })

        res.push({
            tag: 'h3',
            attrs: {
                style: 'margin-left: 30px;'
            },
            content: services[item]
        })

        res.push({
            block: 'order',
            elem: 'service-info',
            elemMods: {
                type: item,
                access: true
            },
            attrs: {
                style: 'margin-bottom: 50px;'
            },
            order: { info: {} }
        })

        resAcc.push({
            block: 'order',
            elem: 'service-info',
            elemMods: {
                type: item,
                access: false
            },
            attrs: {
                style: 'margin-bottom: 50px;'
            },
            order: { 
                info: {
                    ip: '2',
                    volume: '256Кб/с',
                    pool: '/13',
                    relation: '1355',

                    g70x: 'G.703',

                    e1Stream: '123',
                    alertType: 'ОКС-7',
                    countOfConnectionLine: 12,
                    crc4Support: 'Да',
                    networkPart: 'User',
            
                    presentationMethod: 'ОТТ',
            
                    countOfLines: 4,
                    countOfNumbers: 16,
                    typeOfClient: 'Какой-то тип клиента',
            
                    mikrotik: 'Клиента',
                    internet: 'СТОП',
                    needAgree: 'Да',
            
                    schema: 'SomeFile', // File
                    pm: 'Не требуется',
            
                    useDefaultBlackList: 'true',
                    blackListFile: 'SomeFile', // File
            
                    layingMethod: 'Штробление стен ',
                    countOfPorts: 10,
                    objectPhoto: 'Some file', // File
            
                    countOfUtits: 10,
                    rack: 'Клиента',
                    powerConsumption: '1000 МВ',
                    montageNeed: true,
                    connetionNeed: true,
                    confirmDocument: 'Some File' // File
                }
            }
        })
    })

    return {
        view: 'page-index',
        title: 'Тестирование сервисов',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: {
            content: [
                {
                    block: 'link',
                    mods: {
                        theme: 'islands',
                        size: 'xl'
                    },
                    attrs: {
                        style: 'margin-left: 30px;'
                    },
                    url: `/test?access=${(access)?'no':'yes'}`,
                    content: (access)?'Выключить доступ к полям':'Получить доступ к полям'
                },
                {
                    content: (access)?res:resAcc
                }
            ]
        }
    };
};
