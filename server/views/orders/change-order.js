module.exports = function(opt, data) {
  const order = data.order;

  return {
      view: 'page-index',
      title: 'Изменение ёмкости',
      meta: {
          description: 'СУЗ',
          og: {
              url: 'https://ops.miranda-media.ru',
              siteName: 'СУЗ 2.0'
          }
      },
      page: [
          {
            block: 'cool-head',
            content: [
              {
                elem: 'title',
                content: [
                  'Изменение заказа',
                  {
                    block: 'link',
                    mods: {
                      theme: 'islands',
                      size: 'xl'
                    },
                    url: `/order/${order.id}/info`,
                    content: `#${order.id}`
                  }
                ]
              }
            ]
          },
          {
            block: 'change-order',
            order: order,
            js: {
              id: order.id
            }
          }
      ]
  }
};
