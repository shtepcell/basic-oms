block('pager')(
    def()(function() {
        
        return {
            block: 'pager',
            page: this.data.options.pageNumber,
            records: this.data.options.records,
            perPage: this.data.options.perPage
        }
    })
);
