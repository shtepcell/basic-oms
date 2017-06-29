block('pager')(
    def()(function() {

        return this.extend(this.ctx, {
            page: this.data.locals.pager.pageNumber,
            records: this.data.locals.pager.records,
            perPage: this.data.locals.pager.perPage
        });
    })
);
