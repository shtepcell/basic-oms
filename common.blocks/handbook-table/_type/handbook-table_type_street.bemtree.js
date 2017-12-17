block('handbook-table').mod('type', 'street')
    .elem('tbody')(
        content()(function() {
            var rows = [],
                street = this.data.locals.street;

            if (street && street.length) {
                street.forEach(function(item) {
                    rows.push({
                        block: 'handbook-table',
                        elem: 'row',
                        elemMods: {
                            type: 'street'
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

block('handbook-table').mod('type', 'street')
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
