block('ultra-table').elem('holidays').content()(function() {
    var _data = this.ctx.data;

    var content = _data.map( item => {
        var year = item.date.getFullYear();
        var month = item.date.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = item.date.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        var cnt = `${day}-${month}-${year}`;

        return {
            tag: 'tr',
            content: [
                {
                    tag: 'td',
                    content: cnt
                }
            ]
        }
    })

    return [
        {
            tag: 'tbody',
            content: content
        }
    ];
});
