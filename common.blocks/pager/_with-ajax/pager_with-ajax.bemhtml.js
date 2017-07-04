block('pager').mod('with-ajax', true).def()(function() {
    return applyNext({ hasAjax: true });
});

block('button').match(function() {
    return this.hasAjax && [].concat(this.ctx.mix)
        .some(function(item) {
            return item.block === 'pager' && item.elem === 'item';
        });
}).mix()(function() {
	this.ctx.mix = this.ctx.mix.concat({
		block: 'pager',
		elem: 'item',
		elemMods: {
			ajax: true
		}
	});

	return applyNext();
});