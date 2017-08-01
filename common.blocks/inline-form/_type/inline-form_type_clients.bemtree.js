block('inline-form').mod('type', 'clients').def()(function() {
    this.ctx.localParams = this.ctx.js = {
        clientTypeArr: this.data.locals.clientTypeArr
    };

    return applyNext();
});

