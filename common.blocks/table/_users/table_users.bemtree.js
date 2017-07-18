block('table').mod('users').content()(function() {
    return [
        {
            block: 'thead',
            mods: {
                users: true
            }
        },
        {
            block: 'tbody',
            mods: {
                users: true
            },
            users: this.data.locals.users
        }
    ];
});
