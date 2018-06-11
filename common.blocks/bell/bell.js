modules.define('bell', ['i-bem-dom', 'jquery'],
    function(provide, bemDom, $) {

provide(bemDom.declBlock('bell',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var socket = io();
                    var count;
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: `/getNotifyCount`,
                        timeout: 5000,
                        context: this,
                        data: {},
                        error: function(err) {
                            console.error('Error');
                        },
                        success: function(res) {
                            if(res.count != count && res.count > 0) {
                                count = res.count;
                                bemDom.update(
                                    bell,
                                    BEMHTML.apply({
                                        block: 'link',
                                        mods: { theme: 'islands', size: 'l' },
                                        tag: 'a',
                                        attrs: {href: '/notifies'},
                                        mix: { block: 'navigator', elem: 'link' },
                                        url: '/notifies',
                                        content: [
                                            `(${count})`,
                                            {
                                                block: 'icon',
                                                url: '/alarm.svg',
                                                mix: 'navigator__alarm'
                                            }
                                        ]
                                    })
                                )
                            }
                        }
                    })

                    var me = this.params.user;

                    var bell = this.domElem;

                    socket.on('new notify', function (ntf) {
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: `/getNotifyCount`,
                            timeout: 5000,
                            context: this,
                            data: {},
                            error: function(err) {
                                console.error('Error');
                            },
                            success: function(res) {
                                if(res.count != count && res.count > 0) {
                                    count = res.count;
                                    bemDom.update(
                                        bell,
                                        BEMHTML.apply({
                                            block: 'link',
                                            mods: { theme: 'islands', size: 'l' },
                                            tag: 'a',
                                            attrs: {href: '/notifies'},
                                            mix: { block: 'navigator', elem: 'link' },
                                            url: '/notifies',
                                            content: [
                                                `(${count})`,
                                                {
                                                    block: 'icon',
                                                    url: '/alarm.svg',
                                                    mix: 'navigator__alarm'
                                                }
                                            ]
                                        })
                                    )
                                }
                            }
                        })


                    })

                }
            }
        }
    },
    {

    })
);

});
