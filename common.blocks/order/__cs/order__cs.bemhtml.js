block('order').elem('cs').content()(function () {
    var cs = this.ctx.cs;
    var status = 'ok';

    if (cs<0) status = 'red';
    if (cs>=0 && cs <=3) status = 'warning';

    if(cs === null) {
        cs = '-';
        status = 'ok';
    }
    return [
        {
            elem: 'cs-title',
            content: 'Контрольный срок:'
        },
        {
            elem: 'cs-number',
            elemMods: {
                status: status
            },
            content: `${cs}`
        }
    ]
})
