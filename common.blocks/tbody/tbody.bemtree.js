block('tbody').content()(function() {

    var data = this.ctx.data,
        datasets = this.ctx.datasets,
        ret = [];

    if( !!data && !!datasets ) {

        ret = data.map( item => {

            return {
                tag: 'tr',
                content: datasets.map( i => {
                    return {
                        tag: 'td',
                        content: item[i]
                    }
                })
            }

        })

    }

    return ret;
});
