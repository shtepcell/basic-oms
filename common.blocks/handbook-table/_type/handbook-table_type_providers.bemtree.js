block('handbook-table').mod('type', 'providers')
    .elem('tbody')(
        content()(function() {
            var rows = [],
                prvdrs = this.data.locals.prvdrs;

            if (prvdrs && prvdrs.length) {
                prvdrs.forEach(function(item) {
                    rows.push({
                        block: 'handbook-table',
                        elem: 'row',
                        elemMods: {
                            type: 'providers'
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
                    content: 'Провайдеров не найдено',
                    colspan: 4
                });
            }

            return rows;
        })
    );

block('handbook-table').mod('type', 'providers')
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
                    content: 'Провайдер'
                }
            ]
        })
    );
