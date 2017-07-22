block('handbook-table').mod('type', 'client-types')
    .elem('tbody')(
        content()(function() {
            var rows = [],
                clientTypes = this.data.locals.clientTypes

            if (clientTypes && clientTypes.length) {
                clientTypes.forEach(function(item) {
                    rows.push({
                        block: 'handbook-table',
                        elem: 'row',
                        elemMods: {
                            type: 'client-types'
                        },
                        cellsData: {
                            shortName: item.shortName,
                            name: item.name,
                            _id: item._id
                        }
                    });
                });
            } else {
                rows.push({
                    block: 'handbook-table',
                    elem: 'cell',
                    content: 'Типов клиентов не найдено',
                    colspan: 4
                });
            }

            return rows;
        })
    );

block('handbook-table').mod('type', 'client-types')
    .elem('thead')(
        content()({
            block: 'handbook-table',
            elem: 'head-row',
            content: [
                {
                    elem: 'cell',
                    content: 'Аббревиатура'
                },
                {
                    elem: 'cell',
                    content: 'Название типа клиента'
                }
            ]
        })
    );
