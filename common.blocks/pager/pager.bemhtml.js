block('pager')(
    content()(function() {
        var items = [],
        	_this = this,
            pages = Math.ceil(_this.ctx.records / _this.ctx.perPage),
            hasPreviosStep = _this.ctx.page !== 1;
            hasNextStep = _this.ctx.page !== pages;

        if (hasPreviosStep) {
        	items.push({
        		block: 'link',
        		url: '?page=' + (_this.ctx.page - 1),
        		content: '<',
        		mix: [
        			{
        				block: 'pager',
        				elem: 'item'
        			}
        		]
        	});
        } else {
        	items.push({
        		block: 'pager',
        		elem: 'item',
        		content: '<'
        	});
        }

        for (var i = 1; i <= pages; i++) {
        	if (i !== _this.ctx.page) {
        		items.push({
        			block: 'link',
        			url: '?page=' + i,
        			content: i,
        			mix: [
        				{
        					block: 'pager',
        					elem: 'item'
        				}
        			]
	        	});
        	} else {
        		items.push({
        			block: 'pager',
        			elem: 'item',
        			elemMods: {
        				active: 'yes'
        			},
        			content: i
        		});
        	}
        }

        if (hasNextStep) {
        	items.push({
        		block: 'link',
        		url: '?page=' + (_this.ctx.page + 1),
        		content: '>',
        		mix: [
        			{
        				block: 'pager',
        				elem: 'item'
        			}
        		]
        	});
        } else {
        	items.push({
        		block: 'pager',
        		elem: 'item',
        		content: '>'
        	});
        }

        return items;
    })
);
