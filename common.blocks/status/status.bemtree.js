block('status').content()(function () {
    var stat = this.ctx.statistics,
        deps = this.ctx.deps;
    return [
        {
            elem: 'common',
            content: [
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'label',
                            content: {
                                block: 'link',
                                mods: {
                                    theme: 'islands'
                                },
                                url: '/search',
                                content: 'Всего заказов :'
                            }
                        },
                        {
                            elem: 'data',
                            content: stat.all
                        }
                    ]
                },
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'label',
                            content: {
                                block: 'link',
                                mods: {
                                    theme: 'islands'
                                },
                                url: '/search?final=1&final=2',
                                content: 'Выполненные :'
                            }
                        },
                        {
                            elem: 'data',
                            content: stat.stages.succes.all
                        }
                    ]
                },
                {
                    elem: 'row',
                    content: [
                        {
                            elem: 'label',
                            content:  {
                                block: 'link',
                                mods: {
                                    theme: 'islands'
                                },
                                url: '/search?final=3',
                                content: 'Отклоненные :'
                            }
                        },
                        {
                            elem: 'data',
                            content: stat.stages.reject.all
                        }
                    ]
                }
            ]
        },
        {
            elem: 'detail',
            content: [
                {
                    elem: 'column',
                    content: [
                        {
                            elem: 'column-title',
                            content: [
                                {
                                    elem: 'label',
                                    content: 'В обработке :'
                                },
                                {
                                    elem: 'data',
                                    content: stat.stages.pre.all+stat.stages.build.all
                                }
                            ]
                        },
                        {
                            elem: 'column-content',
                            content: [
                                {
                                    elem: 'column',
                                    content: [
                                        {
                                            elem: 'column-title',
                                            content: [
                                                {
                                                    elem: 'label',
                                                    content: {
                                                        block: 'link',
                                                        mods: {
                                                            theme: 'islands',
                                                            size: 'xl'
                                                        },
                                                        url: '/search?pre=1&pre=2&pre=3',
                                                        content: 'Проработка :'
                                                    }
                                                },
                                                {
                                                    elem: 'data',
                                                    content: stat.stages.pre.all
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    if(stat.deps[item._id]) {
                                                        if(stat.deps[item._id].pre.all > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: item.name + ' :'
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat.deps[item._id].pre.all
                                                                    }
                                                                ]
                                                            })
                                                    }
                                                })
                                                return ret;
                                            }
                                        }
                                    ]
                                },
                                {
                                    elem: 'column',
                                    content: [
                                        {
                                            elem: 'column-title',
                                            content: [
                                                {
                                                    elem: 'label',
                                                    content: {
                                                        block: 'link',
                                                        mods: {
                                                            theme: 'islands'
                                                        },
                                                        url: '/search?build=1&build=2&build=3&build=4&build=5',
                                                        content: 'Реализация :'
                                                    }
                                                },
                                                {
                                                    elem: 'data',
                                                    content: stat.stages.build.all
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    if(stat.deps[item._id]) {
                                                        if(stat.deps[item._id].build.all > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: item.name + ' :'
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat.deps[item._id].build.all
                                                                    }
                                                                ]
                                                            })
                                                    }
                                                })
                                                return ret;
                                            }
                                        }
                                    ]
                                }
                            ]
                        }

                    ]
                },
                {
                    elem: 'column',
                    content: [
                        {
                            elem: 'column-title',
                            content: [
                                {
                                    elem: 'label',
                                    content: 'В том числе просроченые :'
                                },
                                {
                                    elem: 'data',
                                    content: stat.stages.pre.bad+stat.stages.build.bad
                                }
                            ]
                        },
                        {
                            elem: 'column-content',
                            content: [
                                {
                                    elem: 'column',
                                    content: [
                                        {
                                            elem: 'column-title',
                                            content: [
                                                {
                                                    elem: 'label',
                                                    content: {
                                                        elem: 'label',
                                                        content: {
                                                            block: 'link',
                                                            mods: {
                                                                theme: 'islands',
                                                                size: 'xl'
                                                            },
                                                            url: '/search?pre=1&pre=2&pre=3&func=2',
                                                            content: 'Проработка :'
                                                        }
                                                    },
                                                },
                                                {
                                                    elem: 'data',
                                                    content: stat.stages.pre.bad
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    if(stat.deps[item._id]) {
                                                        if(stat.deps[item._id].pre.bad > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: item.name + ' :'
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat.deps[item._id].pre.bad
                                                                    }
                                                                ]
                                                            })
                                                    }
                                                })
                                                return ret;
                                            }
                                        }
                                    ]
                                },
                                {
                                    elem: 'column',
                                    content: [
                                        {
                                            elem: 'column-title',
                                            content: [
                                                {
                                                    elem: 'label',
                                                    content: {
                                                        block: 'link',
                                                        mods: {
                                                            theme: 'islands'
                                                        },
                                                        url: '/search?build=1&build=2&build=3&build=4&build=5&func=2',
                                                        content: 'Реализация :'
                                                    }
                                                },
                                                {
                                                    elem: 'data',
                                                    content: stat.stages.build.bad
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    if(stat.deps[item._id]) {
                                                        if(stat.deps[item._id].build.bad > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: item.name + ' :'
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat.deps[item._id].build.bad
                                                                    }
                                                                ]
                                                            })
                                                    }
                                                })
                                                return ret;
                                            }
                                        }
                                    ]
                                }
                            ]
                        }

                    ]
                }
            ]
        }
    ];
})
