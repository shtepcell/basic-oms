block('bell').content()(function () {
    const user = this.ctx.user;
    const {notifies} = user;

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
                    visible: (notifies > 0)
                },
                content: notifies
            },
            {
                block: 'icon',
                url: (user && notifies > 0)?'/alarm.svg':'/alarm-empty.svg',
                mix: (user && notifies > 0)?'navigator__alarm':''
            }
        ]
    }
})
