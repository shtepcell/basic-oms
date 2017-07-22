modules.define(
    'handbook-table__row', 
    ['input'], 
    function(provide, Input, Row) {

provide(Row.declMod({ modName : 'type', modVal : 'client-types' }, {

    _validate: function() {
        var inputShortName = this.findChildElem('client-type-short-name'),
            inputName = this.findChildElem('client-type-name'),
            inputNameVal,
            inputShortNameVal,
            err = false;

        this._errorText = '';

        if (!(inputShortName && inputName)) {
            this._errorText = 'Что-то пошло не так...';
            return;
        }

        inputShortName = inputShortName.findMixedBlock(Input);
        inputName = inputName.findMixedBlock(Input);

        if (!(inputShortName && inputName)) {
            this._errorText = 'Что-то пошло не так...';
            return;
        }

        inputShortNameVal = inputShortName.getVal();

        if (inputShortNameVal.length <= 0 || inputShortNameVal.length >= 25)
        { 
            inputShortName.setMod('errored');
            this._errorText += 'Абревиатура не может быть пустой или длиннее 25 символов\n';
            err = true
        }

        inputNameVal = inputName.getVal();

        if (inputNameVal.length <= 0 || inputNameVal.length >= 25) 
        {
            inputName.setMod('errored');
            this._errorText += 'Название типа клиента не может быть пустым или длиннее 25 символов\n';
            err = true
        }
        
        if (!err)
            return {
                shortName: inputShortNameVal,
                name: inputNameVal
            }

    }
}, 
{}));

});