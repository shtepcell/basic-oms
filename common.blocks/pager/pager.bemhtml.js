block('pager')(
    js()(true),
    content()(function() {
        var items = [],
            _this = this,
            pages = Math.ceil(_this.ctx.records / _this.ctx.perPage),
            hasPreviosStep = _this.ctx.page !== 1;
            hasNextStep = _this.ctx.page !== pages;


        items.push({
            block: 'button',
            mods: {
                theme: 'islands',
                size: 's',
                disabled: !hasPreviosStep
            },
            text: '<',
            mix: [
                    {
                        block: 'pager',
                        elem: 'item',
                        js: {
                            page: hasPreviosStep ? _this.ctx.page - 1 : undefined
                        }
                    },
                    {
                        block: 'pager',
                        elem: 'item-arrow-prev'
                    }
                ]
        });

        for (var i = 1; i <= pages; i++) {
            items.push({
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 's',
                    disabled: i === _this.ctx.page
                },
                text: i,
                mix: [
                        {
                            block: 'pager',
                            elem: 'item-number'
                        },
                        {
                            block: 'pager',
                            elem: 'item',
                            elemMods: {
                                active: i === _this.ctx.page
                            },
                            js: {
                                page: i !== _this.ctx.page ? i : undefined
                            }
                        }
                    ]
            });
        }

        items.push({
            block: 'button',
            mods: {
                theme: 'islands',
                size: 's',
                disabled: !hasNextStep
            },
            text: '>',
            mix: [
                    {
                        block: 'pager',
                        elem: 'item',
                        js: {
                            page: hasNextStep ? _this.ctx.page + 1 : undefined
                        }
                    },
                    {
                        block: 'pager',
                        elem: 'item-arrow-next'
                    }
                ]
        });

        return items;
    })
);
