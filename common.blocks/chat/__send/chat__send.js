modules.define('chat__send', ['i-bem-dom', 'jquery', 'button', 'textarea',
    'chat__editor', 'chat', 'chat__body', 'select'],
    function(provide, bemDom, $, Button, Input, Tree, Chat, Body, Select) {

provide(bemDom.declElem('chat', 'send',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var button = this.findMixedBlock(Button),
                        tree = this.findParentElem(Tree),
                        input = tree.findChildBlock(Input),
                        select = tree.findChildBlock(Select),
                        chat = tree.findParentBlock(Chat),
                        body = chat.findChildBlock(Body);

                    var anchor = this.params.anchor;

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
                                if(res.isFirst) {
                                    bemDom.update(
                                        body.domElem,
                                        BEMHTML.apply({
                                            block: 'chat',
                                            elem: 'message',
                                            elemMods: {
                                                mine: true
                                            },
                                            author: res.author,
                                            text: res.text,
                                            time: res.time
                                        })
                                    )
                                } else
                                    bemDom.append(
                                        body.domElem,
                                        BEMHTML.apply({
                                            block: 'chat',
                                            elem: 'message',
                                            elemMods: {
                                                mine: true
                                            },
                                            author: res.author,
                                            text: res.text,
                                            time: res.time
                                        })
                                    )
                                body.domElem[0].scrollTop = 99999;
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
