modules.define(
    'handbook-table__row', 
    ['select', 'input'], 
    function(provide, Select, Input, Row) {

provide(Row.declMod({ modName : 'type', modVal : 'providers' }, {

    _validate: function() {
        var select = this.findChildElem('providers-type'),
            inputName = this.findChildElem('providers-name'),
            inputVal,
            err = false;

        this._errorText = '';

        if (!(select && inputName)) {
            this._errorText = 'Что-то пошло не так...';
            return;
        }

        select = select.findMixedBlock(Select);
        inputName = inputName.findMixedBlock(Input);

        if (!(select && inputName)) {
            this._errorText = 'Что-то пошло не так...';
            return;
        }

        if (['STOP', 'VSAT'].indexOf(select.getVal()) === -1)
        { 
            select.setMod('errored');
            this._errorText += 'Ошибка выбора типа провайдера\n';
            err = true
        }

        inputVal = inputName.getVal();

        if (inputVal.length <= 0 || inputVal.length >= 25) 
        {
            inputName.setMod('errored');
            this._errorText += 'Название провайдера не может быть пустым или длиннее 25 символов\n';
            err = true
        }
        
        if (!err)
            return {
                type: select.getVal(),
                name: inputName.getVal()
            }

    },

    _getConfirmText: function() {
        return 'Вы уверены, что хотите удалить провайдера: ' + this.params.cellsData.type + ' ' + this.params.cellsData.name + '?'
    }
}, 
{}));

});