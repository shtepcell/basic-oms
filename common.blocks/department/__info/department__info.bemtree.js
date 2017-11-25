block('department').elem('info').content()(function () {
    var ctx = this.ctx,
        department = ctx.department;

    return [
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: 'Название отдела'
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'input',
                        placeholder: 'Название отдела',
                        name: 'name',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            width: 'available'
                        },
                        val: department.name
                    }
                }
            ]
        },
        {
            elem: 'row',
            content: [
                {
                    elem: 'cell',
                    content: 'Тип отдела'
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'select',
                        mods: {
                            mode: 'radio',
                            theme: 'islands',
                            size: 'm'
                        },
                        val: department.type,
                        name: 'type',
                        options: [
                            {
                                text: 'B2B',
                                val: 'b2b'
                            },
                            {
                                text: 'B2O',
                                val: 'b2o'
                            },
                            {
                                text: 'ГУС/ТЦТЭT',
                                val: 'gus'
                            },
                            {
                                text: 'Технический отдел (Администрация)',
                                val: 'admin'
                            },
                            {
                                text: 'Сетевой отдел',
                                val: 'net'
                            },
                            {
                                text: 'Руководство',
                                val: 'man'
                            }
                        ]
                    }
                }
            ]
        },
        {
            elem: 'row',
            mix: {
                elem: 'row-without-underline'
            }
        },
        {
            elem: 'row',
            mix: {
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
                        text: 'Сохранить изменения'
                    }
                },
                {
                    elem: 'cell',
                    content: {
                        block: 'button',
                        mix: {
                            block: 'department',
                            elem: 'delete',
                            js: {
                                department: department._id
                            }
                        },
                        mods: {
                            theme: 'islands',
                            size: 'm'
                        },
                        text: 'Удалить отдел'
                    }
                }
            ]
        }

    ]
})
