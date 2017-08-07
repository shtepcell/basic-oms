modules.define(
    'suggest',
    ['adress-provider'],
    function(provide, TzDataProvider, Suggest) {

provide(Suggest.declMod({ modName : 'has-dataprovider', modVal : 'adress' }, {
    /** @override */
    _createDataProvider : function() {
        return new TzDataProvider(this.params.data);
    }
}));

});
