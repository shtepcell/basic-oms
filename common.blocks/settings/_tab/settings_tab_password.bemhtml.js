block('settings').mod('tab', 'password').content()(function () {

    return [
        {
            elem: 'head',
            content: 'Изменение пароля'
        },
        {
            elem: 'body',
            action: '/settings/password',
            js: true,
            content: [
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Введите текущий пароль'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'input',
                                name: 'password_old',
                                mods: {
                                    type: 'password',
                                    theme: 'islands',
                                    size: 'm',
                                    width: 'available'
                                }
                            }
                        }
                    ]
                },
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Введите новый пароль'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'input',
                                name: 'password_new',
                                mods: {
                                    type: 'password',
                                    theme: 'islands',
                                    size: 'm',
                                    width: 'available'
                                }
                            }
                        }
                    ]
                },
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: 'Повторите новый пароль'
                        },
                        {
                            elem: 'cell',
                            content: {
                                block: 'input',
                                name: 'password_repeat',
                                mods: {
                                    type: 'password',
                                    theme: 'islands',
                                    size: 'm',
                                    width: 'available'
                                }
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
                            text: 'Изменить пароль'
                        }
                    ]
                }
            ]
        },
        // {
        //     elem: 'action',
        //     content: [
        //         {
        //             block: 'button',
        //             mods: {
        //                 type: 'submit',
        //                 theme: 'islands',
        //                 size: 'l'
        //             },
        //             text: 'Изменить пароль'
        //         }
        //     ]
        // }
    ]
})
