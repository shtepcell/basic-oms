block('ultra-table').content()(function() {

    var _data = this.ctx.data,
        _fields = this.ctx.fields;

    var titles = [],
        datasets = [];

    _fields.forEach( item => {
        titles.push(item.name);
        datasets.push(item.field)
    });


    return [
        {
            block: 'thead',
            titles: titles
        },
        {
            block: 'tbody',
            datasets: datasets,
            data: _data
        }
    ];
});
