module.exports = function(opt, data){
    var orders = data.orders;

    var opt = opt || {},
        pagerId;

    var users = data.users,
        user = data.__user;

    if (opt.pagers && opt.pagers.length)
        pagerId = opt.pagers[0];

    var tab = opt.tab;

    var type = '';

    switch (user.department.type) {
        case 'gus':
        case 'sks':
            type = 'gus';
            break;

        case 'b2o':
            type = 'b2o';
            break;

        case 'b2b':
            type = 'b2b';
            break;

        case 'net':
            type = 'default';
            break;
    }

    return {
        view: 'page-index',
        title: 'Мои заказы',
        meta: {
            description: 'СУЗ 2.0',
            og: {
                url: 'https://suz.miranda-media.ru',
                siteName: 'СУЗ 2.0'
            }
        },
        page: [
          {
              block: 'switcher',
              mods: {
                  display: true,
                  type: type
              },
              user: user,
              tab: tab
          },
          {
              block: 'wrapper',
              mods: {
                  size: 'l'
              },
              content: [

                  {
                      block: 'short-filter',
                      dataset: data.dataset,
                      query: data.params
                  },
                  // {
                  //     block: 'table',
                  //     mods: {
                  //         type: 'order',
                  //         width: 'available'
                  //     },
                  //     params: data.params,
                  //     data: orders
                  // },
                  {
                      block: 'orders-table',
                      params: data.params,
                      services: data.dataset.services,
                      flags: data.dataset.flags,
                      params: data.params,
                      orders: orders
                  },
                  {
                      block: 'pager',
                      attrs: {
                          id: pagerId
                      }
                  }
              ]
          }
        ]
    };
};
