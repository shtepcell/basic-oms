block('department').content()(function () {
    var ctx = this.ctx;

    var cities = ctx.cities.map( item => {
        return `${item.type} ${item.name}`;
    });

    var ret = [
        {
            block: 'title',
            mods: {
                lvl: '3'
            },
            content: 'Редактирование отдела'
        },
        {
            elem: 'info',
            department: ctx.department,
            url: `/admin/departments/${ctx.department._id}`,
            js: true
        }
    ];

    if(ctx.department.type == 'gus') {
        ret.push({
            block: 'title',
            mods: {
                lvl: '4'
            },
            content: 'Обслуживаемые города'
        })

        ret.push({
            elem: 'cities',
            own: ctx.department.cities,
            cities: cities,
            url: `/admin/departments/${ctx.department._id}/city`
        })
    }

    return ret;
})
