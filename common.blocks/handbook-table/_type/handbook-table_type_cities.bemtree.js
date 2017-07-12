block('handbook-table').mod('type', 'cities')
    .elem('tbody')(
        content()(function() {
            var rows = [],
                cities = this.data.locals.cities;

            if (cities && cities.length) {
                cities.forEach(function(item) {
                    rows.push({
                        block: 'handbook-table',
                        elem: 'row',
                        elemMods: {
                            type: 'cities'
                        },
                        cellsData: {
                            type: item.type,
                            name: item.name,
                            _id: item._id
                        }
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
