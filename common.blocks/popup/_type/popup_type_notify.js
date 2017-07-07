modules.define('popup__success', ['i-bem-dom'], function (provide, BEMDOM) {
        provide(BEMDOM.declElem('popup', 'success', {
            onSetMod: {
                js : {
                    inited : function() {
                        this.setMod('some');
                    }
                },
                some : function () {
                    console.log('sadasdsa');

                }
        }
    }))
});
