modules.define('input',
(provide, Input) => {
  provide(Input.declMod({modName: 'type', modVal: 'cms'}, {
    onSetMod: {
      js: {
        inited: function() {
          this.__base.apply(this, arguments);
          this._elem('control').domElem.mask('00-000000-0', {
            placeholder: '__-______-_'
          });
        }
      }
    },
    getVal: function() {
      // let val = this._elem('control').domElem.val();
      // return val.replace(/\+7|[\s-()]/g, '');
    }
  }));
});