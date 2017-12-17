modules.define(
    'inline-form',
    ['select', 'input'],
    function(provide, Select, Input, BEMDOM) {

provide(BEMDOM.declMod({ modName : 'type', modVal : 'street' }, {

    _validate: function() {
        var select = this.findChildElem('street-type'),
            inputName = this.findChildElem('street-name'),
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

        if (['ул.', 'пер.', 'кв.', 'пл.', 'пр-т.', 'ш.'].indexOf(select.getVal()) == -1)
        {
            select.setMod('errored');
            this._errorText += 'Ошибка выбора типа населенного пункта\n';
            err = true
        }

        inputVal = inputName.getVal();

        if (inputVal.length <= 0 || inputVal.length >= 50)
        {
            inputName.setMod('errored');
            this._errorText += 'Название города не может быть пустым или длиннее 50 символов\n';
            err = true
        }

        if (!err)
            return {
                type: select.getVal(),
                name: inputName.getVal()
            }
    }
},
{}));

});
