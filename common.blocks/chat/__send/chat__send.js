modules.define('chat__send', ['i-bem-dom', 'jquery', 'button', 'textarea',
    'chat__editor', 'chat', 'chat__body', 'select', 'BEMHTML'],
    function(provide, bemDom, $, Button, Input, Tree, Chat, Body, Select, BEMHTML) {

provide(bemDom.declElem('chat', 'send',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var socket = io();

                    var button = this.findMixedBlock(Button),
                        tree = this.findParentElem(Tree),
                        input = tree.findChildBlock(Input),
                        select = tree.findChildBlock(Select),
                        chat = tree.findParentBlock(Chat),
                        body = chat.findChildBlock(Body);

                    var anchor = this.params.anchor,
                        me = this.params.me;

                    socket.on('new message', function (msg) {
                        if(msg.anchor == anchor) {
                            var msgBlock = {
                                block: 'chat',
                                elem: 'message',
                                elemMods: {
                                    mine: (me == msg.author)
                                },
                                author: msg.author,
                                text: msg.text,
                                time: msg.time
                            };

                            if(msg.isFirst)
                                bemDom.update(
                                    body.domElem,
                                    BEMHTML.apply(msgBlock)
                                )
                            else
                                bemDom.append(
                                    body.domElem,
                                    BEMHTML.apply(msgBlock)
                                )
                                
                            body.domElem[0].scrollTop = 99999;
                        }
                    })


                    button._domEvents().on('click', function(e) {
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: `/chat/${anchor}`,
                            timeout: 5000,
                            context: this,
                            data: {
                                text: input.getVal(),
                                recipients: select.getVal()
                            },
                            error: function(err) {
                                console.error('Error');
                            },
                            success: function(res) {
                                input.setVal('');
                                select.setVal([]);
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
