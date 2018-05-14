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
                                url: '/search?clear',
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
                            content: stat.succes
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
                            content: stat.reject
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
                                    content:  {
                                        block: 'link',
                                        mods: {
                                            theme: 'islands'
                                        },
                                        url: '/search?pre=1&pre=2&pre=3&pre=4&build=1&build=2&build=3&build=4&build=5&build=6',
                                        content: 'В обработке :'
                                    }
                                },
                                {
                                    elem: 'data',
                                    content: stat.pre + stat.build
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
                                                        url: '/search?pre=1&pre=2&pre=3&pre=4',
                                                        content: 'Проработка :'
                                                    }
                                                },
                                                {
                                                    elem: 'data',
                                                    content: stat.pre
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    var stages = '';

                                                    switch (item.type) {
                                                        case 'b2b':
                                                            stages = 'pre=3';
                                                            break;
                                                        case 'b2o':
                                                            stages = 'pre=3&pre=2';
                                                            break;
                                                        case 'gus':
                                                            stages = 'pre=1';
                                                            break;
                                                        case 'sks':
                                                            stages = 'pre=4';
                                                            break;
                                                    }

                                                    if(stat[item._id]) {
                                                        if(stat[item._id].pre > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: {
                                                                            block: 'link',
                                                                            mods: {
                                                                                theme: 'islands',
                                                                                size: 'm'
                                                                            },
                                                                            url: `/search?${stages}&resp=${item._id}`,
                                                                            content: item.name + ' :'
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat[item._id].pre
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
                                                        url: '/search?build=1&build=2&build=3&build=4&build=5&build=6',
                                                        content: 'Реализация :'
                                                    }
                                                },
                                                {
                                                    elem: 'data',
                                                    content: stat.build
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    var stages = '';

                                                    switch (item.type) {
                                                        case 'b2b':
                                                            stages = 'build=5';
                                                            break;
                                                        case 'b2o':
                                                            stages = 'build=3&build=5';
                                                            break;
                                                        case 'gus':
                                                            stages = 'build=1&build=2';
                                                            break;
                                                        case 'sks':
                                                            stages = 'build=6';
                                                            break;
                                                        case 'net':
                                                            stages = 'build=4';
                                                            break;
                                                    }

                                                    if(stat[item._id]) {
                                                        if(stat[item._id].build > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: {
                                                                            block: 'link',
                                                                            mods: {
                                                                                theme: 'islands',
                                                                                size: 'm'
                                                                            },
                                                                            url: `/search?${stages}&resp=${item._id}`,
                                                                            content: item.name + ' :'
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat[item._id].build
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
                                    content: {
                                        block: 'link',
                                        mods: {
                                            theme: 'islands'
                                        },
                                        url: '/search?func=2&pre=1&pre=2&pre=3&pre=4&build=1&build=2&build=3&build=4&build=5&build=6',
                                        content: 'В том числе просроченые :'
                                    }
                                },
                                {
                                    elem: 'data',
                                    content: stat['pre-deadline']+stat['build-deadline']
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
                                                    content: stat['pre-deadline']
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    var stages = '';

                                                    switch (item.type) {
                                                        case 'b2b':
                                                            stages = 'pre=3';
                                                            break;
                                                        case 'b2o':
                                                            stages = 'pre=3&pre=2';
                                                            break;
                                                        case 'gus':
                                                            stages = 'pre=1';
                                                            break;
                                                        case 'sks':
                                                            stages = 'pre=4';
                                                            break;
                                                    }

                                                    if(stat[item._id]) {
                                                        if(stat[item._id]['pre-deadline'] > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: {
                                                                            block: 'link',
                                                                            mods: {
                                                                                theme: 'islands',
                                                                                size: 'm'
                                                                            },
                                                                            url: `/search?${stages}&func=2&resp=${item._id}`,
                                                                            content: item.name + ' :'
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat[item._id]['pre-deadline']
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
                                                    content: stat['build-deadline']
                                                }
                                            ]
                                        },
                                        {
                                            elem: 'column-data',
                                            content: function () {
                                                var ret = [];
                                                deps.forEach( item => {
                                                    var stages = '';

                                                    switch (item.type) {
                                                        case 'b2b':
                                                            stages = 'build=5';
                                                            break;
                                                        case 'b2o':
                                                            stages = 'build=3&build=5';
                                                            break;
                                                        case 'gus':
                                                            stages = 'build=1&build=2';
                                                            break;
                                                        case 'sks':
                                                            stages = 'build=6';
                                                            break;
                                                        case 'net':
                                                            stages = 'build=4';
                                                            break;
                                                    }

                                                    if(stat[item._id]) {
                                                        if(stat[item._id]['build-deadline'] > 0)
                                                            ret.push({
                                                                elem: 'row',
                                                                content: [
                                                                    {
                                                                        elem: 'label',
                                                                        content: {
                                                                            block: 'link',
                                                                            mods: {
                                                                                theme: 'islands',
                                                                                size: 'm'
                                                                            },
                                                                            url: `/search?${stages}&func=2&resp=${item._id}`,
                                                                            content: item.name + ' :'
                                                                        }
                                                                    },
                                                                    {
                                                                        elem: 'data',
                                                                        content: stat[item._id]['build-deadline']
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
