block('ultra-table').content()(function() {

    var _data = this.ctx.data,
        _fields = this.ctx.fields;

    var titles = [],
        datasets = [];

    _fields.forEach( item => {
        titles.push(item.name);
        datasets.push(item.getContent)
    });


    return [
        {
            block: 'thead',
            titles: titles
        },
        {
            block: 'tbody',
            url:  this.ctx.url,
            template:  this.ctx.template,
            datasets: datasets,
            data: _data
        }
    ];
});
