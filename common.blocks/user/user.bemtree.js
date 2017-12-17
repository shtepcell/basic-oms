block('user').content()(function () {
    var ctx = this.ctx,
        user = ctx.user,
        page = ctx.page,
        deps = ctx.deps,
        guss = [],
        initiators = [];

    deps = deps.map( item => {
        if(item.type == 'gus') guss.push({
            val: ''+item._id,
            text: item.name
        })
        if(item.type == 'b2o' || item.type == 'b2b') initiators.push({
            val: ''+item._id,
            text: item.name
        })
        return {
            val: ''+item._id,
            text: item.name
        }
    });

    var fields = [
        {
            block: 'title',
            mods: {
                lvl: '4'
            },
            showT: true,
            content: 'Основная информация:'
        },
        {
            text: 'Логин',
            val: (page!='create')?user.login:'',
            access: page == 'create',
            show: true,
            input: {
                type: 'text',
                name: 'login',
                placeholder: 'example'
            }
        },
        {
            text: 'Пароль',
            val: '',
            access: true,
            show: page == 'create',
            input: {
                type: 'password',
                name: 'password'
            }
        },
        {
            text: 'Повторите пароль',
            val: '',
            access: true,
            show: page == 'create',
            input: {
                type: 'password',
                name: 'passwordRep'
            }
        },
        {
            text: 'Ф.И.О.',
            val: (page!='create')?user.name:'',
            access: true,
            show: true,
            input: {
                type: 'text',
                name: 'name',
                placeholder: 'Иванов Иван Иванович'
            }
        },
        {
            text: 'E-mail',
            val: (page!='create')?user.email:'',
            access: true,
            show: true,
            input: {
                type: 'text',
                name: 'email',
                placeholder: 'example@miranda-media.ru'
            }
        },
        {
            text: 'Телефон',
            val: (page!='create')?user.phone:'',
            access: true,
            show: true,
            input: {
                type: 'text',
                name: 'phone',
                placeholder: '+79787654321'
            }
        },
        {
            text: 'Отдел',
            val: (page=='profile')?user.department.name:(page!='create')?`${user.department}`:'',
            access: page != 'profile',
            show: true,
            input: {
                type: 'select',
                name: 'department',
                data: deps
            }
        },
        'space',
        {
            block: 'title',
            mods: {
                lvl: '4'
            },
            showT: page != 'create',
            content: 'Изменение пароля:'
        },
        {
            text: 'Старый пароль',
            val: '',
            access: true,
            show: page == 'profile',
            input: {
                type: 'password',
                name: 'passwordOld'
            }
        },
        {
            text: 'Новый пароль',
            val: '',
            access: true,
            show: page != 'create',
            input: {
                type: 'password',
                name: 'password'
            }
        },
        {
            text: 'Повторите новый пароль',
            val: '',
            access: true,
            show: page != 'create',
            input: {
                type: 'password',
                name: 'passwordRep'
            }
        },
        'space',
        {
            block: 'title',
            mods: {
                lvl: '4'
            },
            showT: page == 'profile',
            content: 'Настройки отображения главной страницы:'
        },
        // {
        //     text: 'Отдел-инициатор',
        //     val: (page=='profile')?user.settings.main.initiators:'',
        //     access: page == 'profile',
        //     show: page == 'profile',
        //     input: {
        //         type: 'select',
        //         multi: true,
        //         name: 'initiators',
        //         data: initiators
        //     }
        // },
        {
            text: 'Зона ответственности',
            val: (page=='profile')?user.settings.main.zone:'',
            access: page == 'profile',
            show: page == 'profile',
            input: {
                type: 'select',
                multi: true,
                name: 'zone',
                data: guss
            }
        },
        {
            text: 'Этапы',
            val: (page=='profile')?user.settings.main.stage:'',
            access: page == 'profile',
            show: page == 'profile',
            input: {
                type: 'select',
                multi: true,
                name: 'stage',
                data: [
                    {
                        val: 'client-match',
                        text: 'Согл. с кл.'
                    },
                    {
                        val: 'client-notify',
                        text: 'Увед. кл.'
                    },
                    {
                        val: 'all-pre',
                        text: 'Пр. по ГЗП и STOP/VSAT'
                    },
                    {
                        val: 'gzp-pre',
                        text: 'Пр. по ГЗП'
                    },
                    {
                        val: 'gzp-build',
                        text: 'Орг. ГЗП'
                    },
                    {
                        val: 'install-devices',
                        text: 'Установка об.'
                    },
                    {
                        val: 'stop-pre',
                        text: 'Пр. по STOP/VSAT'
                    },
                    {
                        val: 'stop-build',
                        text: 'Орг. STOP/VSAT'
                    },
                    {
                        val: 'network',
                        text: 'Настройка сети'
                    }
                ]
            }
        },
        'space',
        {
            text: '',
            val: (page=='profile')?user.settings.sendEmail:'',
            access: page == 'profile',
            show: page == 'profile',
            input: {
                placeholder: 'Отправлять уведомления на E-mail',
                type: 'checkbox',
                name: 'sendEmail'
            }
        },
        'space'
    ];

    var ret = [];

    fields.forEach( item => {
        if(item == 'space')
            ret.push({
                elem: 'row',
                mix: {
                    block: 'user',
                    elem: 'row-without-underline'
                }
            });
        if(item.block == 'title' && item.showT)
            ret.push({
                elem: 'row',
                mix: {
                    block: 'user',
                    elem: 'row-without-underline'
                },
                content: item
            });
        if(item.show) {
            if(item.access) {
                ret.push({
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: item.text
                        },
                        {
                            elem: 'cell',
                            content: {
                                elem: 'input',
                                val: item.val,
                                placeholder: item.input.placeholder,
                                type: item.input.type,
                                multi: item.input.multi,
                                name: item.input.name,
                                data: (item.input.type=='select')?item.input.data:[]
                            }
                        }
                    ]
                })
            } else {
                ret.push({
                    elem: 'row',
                    content: [
                        {
                            elem: 'cell',
                            content: item.text
                        },
                        {
                            elem: 'cell',
                            content: item.val
                        }
                    ]
                })
            }
        }
    })
    var dlt = {
        elem: 'cell',
        content: {}
    };

    if(page == 'edit') {
        dlt = {
            elem: 'cell',
            content: {
                block: 'button',
                mix: {
                    block: 'user',
                    elem: 'delete',
                    js: {
                        user: user.login
                    }
                },
                mods: {
                    theme: 'islands',
                    size: 'm'
                },
                text: 'Удалить'
            }
        };
    };

    ret.push({
        elem: 'row',
        mix: {
            block: 'user',
            elem: 'row-without-underline'
        },
        content: [
            {
                elem: 'cell',
                content: {
                    block: 'button',
                    mods: {
                        theme: 'islands',
                        size: 'm',
                        type: 'submit'
                    },
                    text: (page=='create')?'Создать':'Сохранить все изменения'
                }
            },
            dlt
        ]
    })

    var namePage;
    switch (page) {
        case 'create':
            namePage = 'Создание пользователя';
            break;
        case 'profile':
            namePage = 'Настройки';
            break;
        default:
            namePage = `Редактирование пользователя "${user.login}"`;
            break;

    }
    return [
        {
            block: 'title',
            mods: {
                lvl: '3'
            },
            content: namePage
        },
        ret
    ];
});
