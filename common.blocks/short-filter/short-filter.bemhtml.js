block('short-filter').tag()('form');

block('short-filter').content()(function () {
    var dataset = this.ctx.dataset;
    var query = this.ctx.query;

    dataset.services = Object.keys(dataset.services).map( (val) => {
        return {
            val: val,
            text: dataset.services[val]
        }
    })

    return {
        block: 'control-group',
        content: [
            'Фильтр : ',
            {
                block: 'input',
                mix: {
                    block: 'short-filter',
                    elem: 'id',
                    elemMods: {
                        error: query.id_error
                    }
                },
                name: 'id',
                val: query.id || '',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    type: 'search'
                },
                autocomplete: false,
                placeholder: 'ID'
            },
            {
                block: 'input',
                mix: {
                    block: 'short-filter',
                    elem: 'cms'
                },
                name: 'cms',
                val: query.cms || '',
                mods: {
                    theme: 'islands',
                    size: 'm',
                    type: 'search'
                },
                autocomplete: false,
                placeholder: 'CMS'
            },
            {
                block : 'suggest',
                mix: 'short-filter__client',
                mods : {
                    theme : 'islands',
                    size : 'm',
                    'has-dataprovider' : 'adress'
                },
                val: query.client || '',
                placeholder: 'Клиент',
                name: 'client',
                dataprovider: {
                    data: dataset['clients']
                }
            },
            {
                block: 'select',
                mix: 'short-filter__service',
                name: 'service',
                val: query.service || '',
                mods: {
                    mode: 'check',
                    theme: 'islands',
                    size: 'm'
                },
                text: 'Услуга',
                options: dataset.services
            },
            {
                block : 'suggest',
                mix: 'short-filter__adress',
                mods : {
                    theme : 'islands',
                    size : 'm',
                    'has-dataprovider' : 'adress'
                },
                val: query.city || '',
                placeholder: 'Город',
                name: 'city',
                dataprovider: {
                    data: dataset['cities']
                }
            },
            {
                block : 'suggest',
                mix: 'short-filter__adress',
                mods : {
                    theme : 'islands',
                    size : 'm',
                    'has-dataprovider' : 'adress'
                },
                val: query.adress || '',
                placeholder: 'Адрес',
                name: 'street',
                dataprovider: {
                    data: dataset['streets']
                }
            },
            {
                block: 'button',
                mods: {
                    type: 'submit',
                    theme: 'islands',
                    size: 'm'
                },
                text: 'Поиск'
            }
        ]
    }
})
