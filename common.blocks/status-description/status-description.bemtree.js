const moment = require('moment');

block('status-description')(
    content()(({ block }, { ts }) => {
        const date = moment(ts).format('DD.MM.YYYY в HH:mm');

        return [
            {
                block,
                elem: 'description',
                content: `Статистика расчитана ${date}`
            },
            {
                block,
                elem: 'hint',
                content: 'Расчет статистики в реальном времени занимает продолжительное время и блокирует работу сервиса для остальных пользователей. Поэтому процесс будет происходить автоматически в фоне каждые 2 часа. ',
            },
        ];
    })
);
