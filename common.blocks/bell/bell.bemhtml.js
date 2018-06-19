block('bell').content()(function () {
    var user = this.ctx.user;

    return {
        block: 'link',
        mods: { theme: 'islands', size: 'l' },
        mix: { block: 'navigator', elem: 'link' },
        url: '/notifies',
        content: [
            {
                block: 'bell',
                elem: 'count',
                elemMods: {
                    visible: (user.notifies>0)
                },
                content: user.notifies
            },
            {
                block: 'icon',
                url: (user && user.notifies>0)?'/alarm.svg':'/alarm-empty.svg',
                mix: (user && user.notifies>0)?'navigator__alarm':''
            }
        ]
    }
})
