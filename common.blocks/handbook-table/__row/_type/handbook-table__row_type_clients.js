modules.define(
    'handbook-table__row',
    ['select', 'input'],
    function(provide, Select, Input, Row) {

provide(Row.declMod({ modName : 'type', modVal : 'clients' }, {

    _validate: function() {
        var select = this.findChildElem('clients-type'),
            inputName = this.findChildElem('clients-name'),
            inputVal,
            err = false,
            clientTypesArr,
            index;

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
        clientTypesArr = select.params.clientTypes.map(function(item) {
            return item._id;
        }),

        index = clientTypesArr.indexOf(select.getVal());
        if (index === -1)
        {
            select.setMod('errored');
            this._errorText += 'Ошибка выбора типа клиента\n';
            err = true
        }

        inputVal = inputName.getVal();

        if (inputVal.length <= 0 || inputVal.length >= 350)
        {
            inputName.setMod('errored');
            this._errorText += 'Название клиента не может быть пустым или длиннее 350 символов\n';
            err = true
        }

        if (!err)
            return {
                type: select.params.clientTypes[index],
                name: inputName.getVal()
            }

    },

    _getConfirmText: function() {
        return 'Вы уверены, что хотите удалить клиента: [' + this.params.cellsData.type.shortName + '] ' + this.params.cellsData.name + '?'
    }
},
{}));

});
