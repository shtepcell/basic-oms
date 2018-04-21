({
    shouldDeps: [
        {
            block: 'profile-popup',
            elem: ['part', 'item', 'info']
        },
        {
            block: 'settings',
            mods: {
                tab: ['main-page', 'table', 'password', 'notify']
            }
        },
        {
            block: 'action',
            elem: 'open-modal'
        },
        {
            block: 'modal',
            mods: {
                theme: 'islands',
                autoclosable: true
            }
        }
    ]
})
