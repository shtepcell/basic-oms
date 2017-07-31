block('tbody').content()(function() {

    var data = this.ctx.data,
        datasets = this.ctx.datasets,
        url = this.ctx.url,
        template = this.ctx.template,
        ret = [];



    if( !!data && !!datasets ) {

        if( !!url )

        ret = data.map( item => {

            return {
                block: 'tbody',
                elem: 'tr',
                content: datasets.map( i => {
                    return {
                        block: 'tbody',
                        elem: 'td',
                        content: item[i]
                    }
                }),
                attrs: {
                    onclick: `location='${url}${item[template]}'`
                }
            }

        })

    }

    return ret;
});
