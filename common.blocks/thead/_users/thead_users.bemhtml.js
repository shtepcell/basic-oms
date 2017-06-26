block('thead').mod('users')(
    tag()('thead'),
    content()(
        {
            tag: 'tr',
            content: [
                {
                    tag: 'td',
                    content: 'Логин'
                },
                {
                    tag: 'td',
                    content: 'Ф.И.О'
                },
                {
                    tag: 'td',
                    content: 'Email'
                },
                {
                    tag: 'td',
                    content: 'Телефон'
                },
                {
                    tag: 'td',
                    content: 'Отдел'
                }
            ]
        }
    )
)
