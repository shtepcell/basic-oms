block('settings').mod('tab', 'main-page').content()(function () {
    var deps = this.ctx.deps;
    var settings = this.ctx.user.settings;

    deps = deps.map( item => {
        return {
            val: item._id+'',
            text: item.name
        }
    })
    return [
        {
            elem: 'head',
            content: 'Параметры отображения заказов на главной странице'
        },
        {
            elem: 'body',
            action: '/settings/main-page',
            js: {
                action: '/settings/main-page'
            },
            content: [
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Зона ответственности'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'checkbox-group',
                                name: 'zone',
                                val: settings.main.zone,
                                mods: { theme: 'islands', size: 'm' },
                                options: deps
                            }
                        }
                    ]
                },
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Этапы заказа'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'checkbox-group',
                                mods: { theme: 'islands', size: 'm' },
                                name: 'stage',
                                val: settings.main.stage,
                                options: [
                                    {
                                        val: 'gzp-pre',
                                        text: 'Проработка по ГЗП'
                                    },
                                    {
                                        val: 'stop-pre',
                                        text: 'Проработка по СТОП/VSAT'
                                    },
                                    {
                                        val: 'client-match',
                                        text: 'Согласование с клиентом'
                                    },
                                    {
                                        val: 'gzp-build',
                                        text: 'Организация ГЗП'
                                    },
                                    {
                                        val: 'install-devices',
                                        text: 'Установка оборудования'
                                    },
                                    {
                                        val: 'stop-build',
                                        text: 'Организация СТОП/VSAT'
                                    },
                                    {
                                        val: 'network',
                                        text: 'Настройка сети'
                                    },
                                    {
                                        val: 'client-notify',
                                        text: 'Уведомление клиента'
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
