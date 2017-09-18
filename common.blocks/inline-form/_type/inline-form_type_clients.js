modules.define(
    'inline-form',
    ['select', 'input'],
    function(provide, Select, Input, BEMDOM) {

provide(BEMDOM.declMod({ modName : 'type', modVal : 'clients' }, {

    _validate: function() {
        var select = this.findChildElem('client-type'),
            inputName = this.findChildElem('client-name'),
            inputVal,
            err = false,
            typeIdArr = this.params.clientTypeArr.map(function(item) {
                return item._id;
            });

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

        if (typeIdArr.indexOf(select.getVal()) == -1)
        {
            select.setMod('errored');
            this._errorText += 'Ошибка выбора типа провайдера\n';
            err = true
        }

        inputVal = inputName.getVal();

        if (inputVal.length <= 0 || inputVal.length >= 350)
        {
            inputName.setMod('errored');
            this._errorText += 'Название провайдера не может быть пустым или длиннее 350 символов\n';
            err = true
        }

        if (!err)
            return {
                typeId: select.getVal(),
                name: inputName.getVal()
            }
    }
},
{}));

});
