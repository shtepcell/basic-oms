block('pager')(
    def()(function() {
        var uniqId = this.ctx.attrs.id;

        return this.extend(this.ctx, {
            page: this.data.locals.pagers[uniqId].pageNumber,
            records: this.data.locals.pagers[uniqId].records,
            perPage: this.data.locals.pagers[uniqId].perPage
        });
    })
);
