modules.define(
    'inline-form', 
    ['select', 'input'], 
    function(provide, Select, Input, BEMDOM) {

provide(BEMDOM.declMod({ modName : 'type', modVal : 'services' }, {

    _validate: function() {
        var select = this.findChildElem('service-type'),
            inputName = this.findChildElem('service-name'),
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

        if (['0', '1', '2', '3'].indexOf(select.getVal()) == -1)
        { 
            select.setMod('errored');
            this._errorText += 'Ошибка выбора услуги\n';
            err = true
        }

        inputVal = inputName.getVal();

        if (inputVal.length <= 0 || inputVal.length >= 25) 
        {
            inputName.setMod('errored');
            this._errorText += 'Название услуги не может быть пустым или длиннее 25 символов\n';
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