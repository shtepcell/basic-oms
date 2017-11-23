block('user').content()(function () {
    var ctx = this.ctx,
        user = ctx.user,
        page = ctx.page,
        deps = ctx.deps;

    var fields = [
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
            'space'
    ];

    var ret = [];
    deps = deps.map( item => {
        return {
            val: ''+item._id,
            text: item.name
        }
    });

    fields.forEach( item => {
        if(item == 'space')
            ret.push({
                elem: 'row',
                mix: {
                    block: 'user',
                    elem: 'row-without-underline'
                },
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
                                name: item.input.name,
                                data: (item.input.type=='select')?deps:[]
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
