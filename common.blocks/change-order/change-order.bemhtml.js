block('change-order').content()(function () {
  const order = this.ctx.order;
  const clientName = order.info.client.name;
  const service = order.info.service;
  const commonVolume = order.info.volume;
  const serviceNames = {
    internet: 'Интернет',
    l2vpn: 'L2VPN',
    l3vpn: 'L3VPN',
    vpls: 'VPLS'
  }

  return [
    {
      elem: 'row',
      content: [
        {
          elem: 'row-name',
          content: 'Клиент :'
        },
        {
          elem: 'row-data',
          content: clientName
        }
      ]
    },
    {
      elem: 'row',
      content: [
        {
          elem: 'row-name',
          content: 'Услуга :'
        },
        {
          elem: 'row-data',
          content: serviceNames[service]
        }
      ]
    },
    {
      elem: 'row',
      content: [
        {
          elem: 'row-name',
          content: 'Текущая ёмкость :'
        },
        {
          elem: 'row-data',
          content: commonVolume
        }
      ]
    },
    {
      elem: 'row',
      content: [
        {
          elem: 'row-name',
          content: 'Новая ёмкость :'
        },
        {
          elem: 'row-data',
          content: {
            block: 'select',
            elem: 'volume',
            val: order.info.volume
          }
        }
      ]
    },
    {
      elem: 'row',
      content: [
        {
          elem: 'row-name',
          content: 'СMS :'
        },
        {
          elem: 'row-data',
          content: {
            block: 'input',
            mods: { theme: 'islands', size: 'm' },
            val: order.info.cms || ''
          }
        }
      ]
    },
    {
      elem: 'action',
      content: {
        block: 'button',
        mods: {
          theme: 'islands',
          size: 'xl'
        },
        mix: 'mne__vpadlu',
        text: 'Отправить заказ на изменение ёмкости'
      }
    }
  ];
})