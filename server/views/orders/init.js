module.exports = function(opt, data) {

    return {
        view: 'page-index',
        title: 'Создание заказа',
        meta: {
            description: 'Страница создания заказа',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
            {
              block: 'cool-head',
              content: [
                {
                  elem: 'title',
                  content: 'Создание заказа'
                }
                // {
                //   elem: 'action',
                //   content: [
                //     {
                //       block: 'button',
                //       mods: {
                //           theme: 'islands',
                //           size: 'l',
                //           type: 'link'
                //       },
                //       url: '/multi-init',
                //       text: 'Инициировтаь из Excel'
                //     }
                //   ]
                // }
              ]
            },
            {
                block: 'wrap',
                elem: 'order',
                content: {
                    block: 'order',
                    action: `/init`,
                    order: opt.order,
                    tab: 'init',
                    user: data.__user,
                    dataset: data.dataset
                }
            }

        ]
    }
};
