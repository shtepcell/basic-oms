modules.define('chat__input', ['i-bem-dom', 'jquery', 'textarea', 'button', 'chat__editor'], function(provide, bemDom, $, Textarea, Button, Tree) {

provide(bemDom.declElem('chat', 'input',
    {
        onSetMod: {
            js: {
                inited: function () {
                    var input = this.findMixedBlock(Textarea),
                        tree = this.findParentElem(Tree),
                        button = tree.findChildBlock(Button);

                    this._events(input).on('change', function () {
                        var val = input.getVal();
                        val = val.trim();

                        if(val.length == 0)
                            button.setMod('disabled');
                        else button.setMod('disabled', false);
                    })
                }
            }
        }
    },
    {

    })
);

});
