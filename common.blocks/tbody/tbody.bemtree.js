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
                        if(Array.isArray(i)) {
                            var result = item;
                            for (var j = 0; j < i.length; j++) {
                                result = result[i[j]];
                            }
                        }
                        return {
                            block: 'tbody',
                            elem: 'td',
                            content: result || item[i]
                        }
                    }),
                    attrs: {
                        onclick: `location='${url}${item[template]}'`
                    }
                }

            })
        else ret = data.map( item => {
            return {
                block: 'tbody',
                elem: 'tr',
                content: datasets.map( i => {
                    if(Array.isArray(i)) {
                        var result = item;
                        for (var j = 0; j < i.length; j++) {
                            result = result[i[j]];
                        }
                    }
                    return {
                        block: 'tbody',
                        elem: 'td',
                        content: result || item[i]
                    }
                })
            }

        })

    }

    return ret;
});
