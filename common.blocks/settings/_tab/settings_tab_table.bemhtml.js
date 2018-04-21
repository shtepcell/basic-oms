block('settings').mod('tab', 'table').content()(function () {
    var set = this.ctx.user.settings.table;

    return [
        {
            elem: 'head',
            content: 'Настройка таблиц заказов'
        },
        {
            elem: 'body',
            action: '/settings/table',
            js: {
                action: '/settings/table'
            },
            content: [
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Количество елементов на одной странице'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'select',
                                mods: { theme: 'islands', size: 'm', mode: 'radio' },
                                name: 'perPage',
                                val: (set)?set.perPage:50,
                                options: [
                                    {
                                        val: 10,
                                        text: '10'
                                    },
                                    {
                                        val: 25,
                                        text: '25'
                                    },
                                    {
                                        val: 50,
                                        text: '50'
                                    },
                                    {
                                        val: 100,
                                        text: '100'
                                    },
                                    {
                                        val: 250,
                                        text: '250'
                                    },
                                    {
                                        val: 500,
                                        text: '500'
                                    },
                                    {
                                        val: 1000,
                                        text: '1000'
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Столбцы'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'checkbox-group',
                                mods: { theme: 'islands', size: 'm', disabled: true },
                                name: 'rows',
                                val: ['id', 'client', 'status', 'service', 'cs', 'adress'],
                                options: [
                                    {
                                        val: 'id',
                                        text: 'ID'
                                    },
                                    {
                                        val: 'client',
                                        text: 'Клиент'
                                    },
                                    {
                                        val: 'status',
                                        text: 'Этап'
                                    },
                                    {
                                        val: 'service',
                                        text: 'Услуга'
                                    },
                                    {
                                        val: 'cs',
                                        text: 'Контрольный срок'
                                    },
                                    {
                                        val: 'adress',
                                        text: 'Адрес'
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    elem: 'action',
                    content: [
                        {
                            block: 'button',
                            mods: {
                                type: 'submit',
                                theme: 'islands',
                                size: 'l'
                            },
                            text: 'Сохранить изменения'
                        }
                    ]
                }
            ]
        }
    ]
})
