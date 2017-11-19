block('user')(
    tag()('form'),
    attrs()(function () {
        return {
            action: '/profile',
            method: 'POST'
        }
    })
)
