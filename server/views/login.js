module.exports = function (opt, data) {

    return {
        view: 'page-index',
        title: 'Авторизация',
        meta: {
            description: 'Страница входа в СУЗ',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
                block: 'form',
                elem: 'login',
                url: data.trg
            },
            {
                block: 'tip',
                content: [
                    {elem: 'appeal', content: 'Уважаемый пользователь!'},
                    {elem: 'p', content: 'Пароль от Вашей учетной записи совпадает с логином.'},
                    {elem: 'p', content: 'Не забудьте поменять его! 😉'}
                 ]
            }
        ]
    };
};
