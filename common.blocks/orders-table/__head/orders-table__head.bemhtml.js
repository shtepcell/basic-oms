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
                                sort: 'info.client',
                                value: ('info.client' == params.sort)?-1*params.value:1
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
                                sort: 'date.init',
                                value: ('date.init' == params.sort)?-1*params.value:1
                            }
                        }
                    },
                    elemMods: {
                        type: 'init'
                    },
                    content: 'Дата инициации'
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
                                sort: 'info.service',
                                value: ('info.service' == params.sort)?-1*params.value:1
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
                                sort: 'info.cms',
                                value: ('info.cms' == params.sort)?-1*params.value:1
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
                                sort: 'info.city',
                                value: ('info.city' == params.sort)?-1*params.value:1
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
