module.exports = function(opt, data) {

    return {
        view: 'page-index',
        title: 'Инициация заказа',
        meta: {
            description: 'Страница инициации заказа',
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
                  content: 'Инициация заказа'
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
