block('tbody').content()(function() {

    var data = this.ctx.data,
        datasets = this.ctx.datasets,
        url = this.ctx.url,
        template = this.ctx.template,
        ret = [];

    if( !!data && !!datasets ) {

        ret = data.map( item => {
            var attrs = {};
            return {
                block: 'tbody',
                elem: 'tr',
                content: datasets.map( i => {

                    if( !!url )
                        attrs.onclick = `location='${url}${item[template]}'`;

                    return {
                        block: 'tbody',
                        elem: 'td',
                        content: i(item),
                        attrs: attrs
                    }
                }),
            }
        })
    }

    return ret;
});
