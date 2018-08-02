block('stages').content()(function () {
  var order = this.ctx.id;

  return [
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'gzp-pre',
            order: order
          }
        },
        content: 'Проработка ГЗП'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'stop-pre',
            order: order
          }
        },
        content: 'Проработка СТОП'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'all-pre',
            order: order
          }
        },
        content: 'Проработка ГЗП и СТОП'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'sks-pre',
            order: order
          }
        },
        content: 'Проработка СКС'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'gzp-build',
            order: order
          }
        },
        content: 'Организация ГЗП'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'stop-build',
            order: order
          }
        },
        content: 'Организация СТОП'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'sks-build',
            order: order
          }
        },
        content: 'Организация СКС'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'network',
            order: order
          }
        },
        content: 'Настройка сети'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'client-match',
            order: order
          }
        },
        content: 'Согласование с клиентом'
    },
    {
        block: 'stages',
        elem: 'item',
        mix: {
          block: 'action',
          elem: 'direct',
          js: {
            stage: 'client-notify',
            order: order
          }
        },
        content: 'Уведомление клиента'
    }
  ]
})
