block('upload').content()(function () {
  return [
    {
      elem: 'title',
      content: 'Загрузите файл:'
    },
    {
      elem: 'action',
      content: [
        {
          block: 'attach',
          mods: {
              theme: 'islands',
              size: 'l'
          },
          button: {
              block: 'button',
              icon: {
                  block: 'icon',
                  mods: {
                      action: 'download'
                  }
              },
              text: 'Выберите файл'
          }
        }
      ]
    }
  ]
})
