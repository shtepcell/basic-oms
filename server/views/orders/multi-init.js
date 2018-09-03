module.exports = function(opt, data) {

    return {
        view: 'page-index',
        title: 'Инициация заказов',
        meta: {
            description: 'Страница множественной инициации',
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
                },
                {
                  elem: 'action',
                  content: [
                    {
                      block: 'button',
                      mods: {
                          theme: 'islands',
                          size: 'l',
                          type: 'link'
                      },
                      url: '/template.xlsx',
                      text: 'Загрузить шаблон'
                    },
                    {
                      block: 'button',
                      mods: {
                          theme: 'islands',
                          size: 'l',
                          type: 'link'
                      },
                      url: '/multi-init',
                      text: 'Загрузить справочники'
                    }
                ]
                }
              ]
            },
            {
              block: 'upload'
            },
            {
              block: 'errors'
            }
        ]
    }
};
