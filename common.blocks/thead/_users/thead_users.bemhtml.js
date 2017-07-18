block('thead').mod('users')(
    tag()('thead'),
    content()(
        {
            tag: 'tr',
            content: [
                {
                    tag: 'th',
                    content: 'Логин',
                    mix: 'login'
                },
                {
                    tag: 'th',
                    content: 'Ф.И.О'
                },
                {
                    tag: 'th',
                    content: 'Email'
                },
                {
                    tag: 'th',
                    content: 'Телефон'
                },
                {
                    tag: 'th',
                    content: 'Отдел'
                }
            ]
        }
    )
)
