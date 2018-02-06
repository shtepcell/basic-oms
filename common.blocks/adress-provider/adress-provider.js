modules.define(
    'adress-provider',
    ['inherit', 'vow', 'sg-dataprovider', 'adress-provider__storage'],
    function(provide, inherit, vow, DataProvider, TzStorage) {

provide(inherit(DataProvider, {
    __constructor : function(data) {
        this.__base.apply(this, arguments);
        this._storage = new TzStorage(data);
    },

    /** @override */
    _getData : function(params) {
        var query = this._buildQuery(params.val),
            deferred = vow.defer();

        if(query) {
            this._storage.find(query, function(err, data) {
                err? deferred.reject(err) : deferred.resolve(data);
            });
        } else {
            deferred.resolve([]);
        }

        return deferred.promise();
    },

    _buildQuery : function(val) {
        if(!val.length) return null;
        val = val.replace(/\[/g, '');
        val = val.replace(/\]/g, '');
        val = val.replace(/\\/g, '');
        val = val.replace(/\(/g, '');
        val = val.replace(/\)/g, '');

        if(val.length > 0)
            return new RegExp('' + val + '', 'i');
        else return null;
    }
}));

});
