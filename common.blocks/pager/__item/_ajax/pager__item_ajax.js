modules.define('pager__item',
    ['location'], function (provide, location, Item) {
    provide(Item.declMod({ modName : 'ajax', modVal : true }, {

        /*
         * TODO
         * @override
         */
        _onClick: function () {
            console.log('clicked');
        }
    }));
});