block('settings').mod('tab', 'notify').content()(function () {

    return [
        {
            elem: 'head',
            content: 'Настройка уведомлений'
        },
        {
            elem: 'body',
            action: '/settings/notify',
            js: {
                action: '/settings/notify'
            },
            content: [
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Отправлять уведомления на Email?'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'checkbox',
                                name: 'send-mail',
                                mods: {
                                    theme: 'islands',
                                    size: 'm',
                                    disabled: true
                                }
                            }
                        }
                    ]
                },
                // {
                //     elem: 'row',
                //     content: [
                //         {
                //             elem: 'cell',
                //             content: 'Какие уведомления вы хотите получать?'
                //         },
                //         {
                //             elem: 'cell',
                //             content: {
                //                 block: 'checkbox-group',
                //                 mods: {
                //                     theme: 'islands',
                //                     size: 'm',
                //                     disabled: true
                //                 },
                //                 name: 'notify',
                //                 options: [
                //                     {
                //                         val: '1',
                //                         text: 'О проработке'
                //                     },
                //                     {
                //                         val: '2',
                //                         text: 'О asd'
                //                     }
                //                 ]
                //             }
                //         }
                //     ]
                // },
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
