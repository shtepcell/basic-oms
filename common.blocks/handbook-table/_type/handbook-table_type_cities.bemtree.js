block('handbook-table').mod('type', 'cities')
    .elem('tbody')(
        content()(function() {
            var rows = [],
                cities = this.data.locals.cities || [{type: 'г.', name: 'Симферополь'}];

            if (cities && cities.length) {
                cities.forEach(function(item) {
                    rows.push({
                        block: 'handbook-table',
                        elem: 'row',
                        content: [
                            {
                                block: 'handbook-table',
                                elem: 'cell',
                                content: item.type
                            }, 
                            {
                                block: 'handbook-table',
                                elem: 'cell',
                                content: item.name
                            }
                        ]
                    });
                });
            } else {
                rows.push({
                    block: 'handbook-table',
                    elem: 'cell',
                    content: 'Ничего не найдено',
                    colspan: 4
                });
            }

            return rows;
        })
    );

block('handbook-table').mod('type', 'cities')
    .elem('thead')(
        content()({
            block: 'handbook-table',
            elem: 'head-row',
            content: [
                {
                    elem: 'cell',
                    content: 'Тип'
                },
                {
                    elem: 'cell',
                    content: 'Название'
                }
            ]
        })
    );