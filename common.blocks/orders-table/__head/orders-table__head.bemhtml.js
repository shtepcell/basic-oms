block('orders-table').elem('head')(
    content()(function () {
        var params = this.ctx.params;

        return [{
            block: 'orders-table',
            elem: 'th',
            content: [
                {
                    block: 'orders-table',
                    elem: 'td',
                    mix: {
                        block: 'action',
                        elem: 'add-params',
                        js: {
                            params: {
                                sort: 'id',
                                value: ('id' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'id'
                    },
                    content: 'ID'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    mix: {
                        block: 'action',
                        elem: 'add-params',
                        js: {
                            params: {
                                sort: 'client',
                                value: ('client' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'client'
                    },
                    content: 'Клиент'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    mix: {
                        block: 'action',
                        elem: 'add-params',
                        js: {
                            params: {
                                sort: 'status',
                                value: ('status' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'status'
                    },
                    content: 'Статус'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    mix: {
                        block: 'action',
                        elem: 'add-params',
                        js: {
                            params: {
                                sort: 'service',
                                value: ('service' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'service'
                    },
                    content: 'Услуга'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    mix: {
                        block: 'action',
                        elem: 'add-params',
                        js: {
                            params: {
                                sort: 'cms',
                                value: ('cms' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'cms'
                    },
                    content: 'CMS'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    mix: {
                        block: 'action',
                        elem: 'add-params',
                        js: {
                            params: {
                                sort: 'adress',
                                value: ('adress' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'adress'
                    },
                    content: 'Адрес'
                },
                {
                    block: 'orders-table',
                    elem: 'td',
                    mix: {
                        block: 'action',
                        elem: 'add-params',
                        js: {
                            params: {
                                sort: 'deadline',
                                value: ('deadline' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'cs'
                    },
                    content: 'КС'
                }
            ]
        }]
    })
)
