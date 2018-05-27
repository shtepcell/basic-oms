block('order').elem('tab')(
    tag()('a'),
    attrs()(function () {
        return { "href": this.ctx.url };
    })
)

block('order').elem('tab').elemMod('display', false).replace()(function () {
    return []
});
