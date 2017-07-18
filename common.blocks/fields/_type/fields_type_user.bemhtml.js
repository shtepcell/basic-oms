// block('fields').mod('type', 'user')(
//     content()(function () {
//         console.log(this.ctx.data);
//         return [
//             {
//                 block: 'fields',
//                 elem: 'title',
//                 content: [
//                     {
//                         block: 'fields',
//                         elem: 'label',
//                         content: 'Логин'
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'label',
//                         content: 'Пароль'
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'label',
//                         content: 'Повторите пароль'
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'label',
//                         content: 'Ф.И.О'
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'label',
//                         content: 'E-mail'
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'label',
//                         content: 'Отдел'
//                     }
//                 ]
//             },
//             {
//                 block: 'fields',
//                 elem: 'body',
//                 content: [
//                     {
//                         block: 'fields',
//                         elem: 'line',
//                         content: {
//                             block: 'input',
//                             mods: {
//                                 theme: 'islands',
//                                 size: 'm'
//                             },
//                             val: this.ctx.data.login
//                             required: true,
//                             name: 'login',
//                             placeholder: 'Логин'
//                         }
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'line',
//                         content: {
//                             block: 'input',
//                             mods: {
//                                 theme: 'islands',
//                                 size: 'm',
//                                 type: 'password'
//                             },
//                             required: true,
//                             name: 'password',
//                             placeholder: 'Пароль'
//                         }
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'line',
//                         content: {
//                             block: 'input',
//                             mods: {
//                                 theme: 'islands',
//                                 size: 'm',
//                                 type: 'password'
//                             },
//                             required: true,
//                             name: 'passwordRep',
//                             placeholder: 'Повторите пароль'
//                         }
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'line',
//                         content: {
//                             block: 'input',
//                             mods: {
//                                 theme: 'islands',
//                                 size: 'm'
//                             },
//                             required: true,
//                             name: 'name',
//                             placeholder: 'Ф.И.О'
//                         }
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'line',
//                         content: {
//                             block: 'input',
//                             mods: {
//                                 theme: 'islands',
//                                 size: 'm'
//                             },
//                             name: 'email',
//                             placeholder: 'E-mail'
//                         }
//                     },
//                     {
//                         block: 'fields',
//                         elem: 'line',
//                         content: {
//                             block: 'select',
//                             mods: {
//                                 mode: 'radio',
//                                 theme: 'islands',
//                                 size: 'm'
//                             },
//                             required: true,
//                             name: 'department',
//                             options: [
//                                 {
//                                     val: 1,
//                                     text: 'Доклад'
//                                 },
//                                 {
//                                     val: 2,
//                                     text: 'Мастер-класс'
//                                 },
//                                 {
//                                     val: 3,
//                                     text: 'Круглый стол'
//                                 }
//                             ]
//                         }
//                     }
//                 ]
//             },
//         ]
//     })
// )
