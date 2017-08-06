block('handbook-table').mod('type', 'clients')
    .elem('tbody')(
        content()(function() {
            var rows = [],
                clients = this.data.locals.clients;

            if (clients && clients.length) {
                clients.forEach(function(item) {
                    rows.push({
                        block: 'handbook-table',
                        elem: 'row',
                        elemMods: {
                            type: 'clients'
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
                    content: 'Клиентов не найдено',
                    colspan: 4
                });
            }

            return rows;
        })
    );

block('handbook-table').mod('type', 'clients')
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
                    content: 'Клиент'
                }
            ]
        })
    );

block('handbook-table').mod('type', 'clients').js()(function() {
    var clientTypeArr = this.data.locals.clientTypeArr;

    return {
        blockParams: clientTypeArr
    };
});