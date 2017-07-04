block('pager').match(function() {
        var uniqId = this.ctx.attrs && this.ctx.attrs.id;

		if (!(uniqId && this.data.locals.pagers && this.data.locals.pagers[uniqId]))
			return true;
	}).replace()('');

block('pager')(
    def()(function() {
        var uniqId = this.ctx.attrs && this.ctx.attrs.id;

        try {
        	return this.extend(this.ctx, {
	            page: this.data.locals.pagers[uniqId].pageNumber,
	            records: this.data.locals.pagers[uniqId].records,
	            perPage: this.data.locals.pagers[uniqId].perPage
	        });
        }
        catch(err) {
        	return applyNext();
        }
    })
);
