block('tbody').mod('users').content()(function () {
    return this.ctx.users.map( user => {
        return {
                tag: 'tr',
                content: [
                    {
                        tag: 'td',
                        content: {
                            block: 'link',
                            mods: {
                                theme: 'islands',
                                size: 'l'
                            },
                            url: '/admin/users/' + user.login,
                            content: user.login
                        }
                    },
                    {
                        tag: 'td',
                        content: user.name
                    },
                    {
                        tag: 'td',
                        content: user.email
                    },
                    {
                        tag: 'td',
                        content: user.phone
                    },
                    {
                        tag: 'td',
                        content: {
                            block: 'link',
                            mods: {
                                theme: 'islands',
                                size: 'l'
                            },
                            url: '/admin/department/' + user.department,
                            content: user.department
                        }
                    }
                ]
            }
    })
})
