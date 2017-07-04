block('pager')(
    js()(true),
    content()(function() {
        var items = [],
            _this = this,
            pages = Math.ceil(_this.ctx.records / _this.ctx.perPage),
            curPage = this.ctx.page,
            hasPreviosStep = curPage !== 1,
            hasNextStep = curPage !== pages,
            leftItems = 3,
            rigthItems = 3,
            diffItems,
            endPage,
            startPage;


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

        items.push(getIElem(1, curPage));

        if (curPage > leftItems && curPage < (pages - rigthItems)) {
            endPage = (pages < curPage + rigthItems ? pages : curPage + rigthItems) - 1;
            startPage = (1 > curPage - leftItems ? 1 : curPage - leftItems) + 1;

            if (startPage - 1 > 1)
                items.push(getEllipsisItem(Math.floor((startPage + 1) / 2)));

            for (var i = startPage; i <= endPage; i++) {
                items.push(getIElem(i, curPage));
            }

            if (pages - endPage > 1)
                items.push(getEllipsisItem(Math.floor((pages + endPage) / 2)));
        } else if (curPage <= leftItems) {
            diffItems = 1 + leftItems - curPage;
            endPage = (pages < curPage + rigthItems + diffItems ? pages : curPage + rigthItems + diffItems) - 1;

            for (var i = 2; i <= endPage; i++) {
                items.push(getIElem(i, curPage));
            }

            if (pages - endPage > 1)
                items.push(getEllipsisItem(Math.floor((pages + endPage) / 2)));
        } else {
            diffItems = rigthItems - (pages - curPage);
            startPage = (1 > curPage - (leftItems + diffItems) ? 1 : curPage - (leftItems + diffItems)) + 1;

            if (startPage - 1 > 1) 
                items.push(getEllipsisItem(Math.floor((startPage + 1) / 2)));

             for (var i = startPage; i <= pages - 1; i++) {
                items.push(getIElem(i, curPage));
            }
        }

        if (pages > 1) 
            items.push(getIElem(pages, curPage));

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
                            page: hasNextStep ? curPage + 1 : undefined
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

function getIElem(i, curPage) {
    return {
            block: 'button',
            mods: {
                theme: 'islands',
                size: 's',
                disabled: i === curPage
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
                            active: i === curPage
                        },
                        js: {
                            page: i !== curPage ? i : undefined
                        }
                    }
                ]
        };
}

function getEllipsisItem(toPage) {
    return {
        block: 'button',
        mods: {
            theme: 'islands',
            size: 's'
        },
        text: '...',
        mix: [
                {
                    block: 'pager',
                    elem: 'item-number'
                },
                {
                    block: 'pager',
                    elem: 'item',
                    js: {
                        page: toPage
                    }
                }
            ]
    };
}