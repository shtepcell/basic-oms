module.exports = function(opt, data) {

    console.log(data.template);
    var fields = parseTemplate(data.template);

    return {
        view: 'page-index',
        title: 'Создание отдела',
        meta: {
            description: 'Страница создания отдела',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'ultra-form',
                action: '/init',
                method: 'POST',
                text: 'Иницировать заявку',
                mods: {
                    theme: 'order'
                },
                fields: fields
            }
        ]
    }
};

function parseTemplate(template) {
    var fields = [];
    template.forEach( item => {
        if(item.fill)
            fields.push({
                name: item.index,
                desc: item.name,
                mods: {
                    type: 'text'
                }
            })
    });
    return fields;
}
