block('ultra-form').content()(function () {
    var ctx = this.ctx,
        data = this.data,
        fields = ctx.fields;

    var ret = [];

    ret = fields.map( item => {
        var _item = {};

        var input;

        if(item.disabled) {

            input = {
                elem: 'value',
                content: item.val
            };

        } else {
            switch (item.mods.type) {
                case 'suggest':
                    input = {
                        block : 'suggest',
                        required: item.required,
                        mods : {
                            theme : 'islands',
                            size : 'm',
                            'has-dataprovider' : item.mods['has-dataprovider']
                        },
                        name: item.name,
                        dataprovider: item.dataprovider
                    }
                    break;
                case 'select':
                    input = {
                        block: 'select',
                        mods: {
                            mode: 'radio',
                            width: 'available',
                            theme: 'islands',
                            size: 'm',
                        },
                        val: item.val,
                        options: item.data,
                        name: item.name
                    }
                    break;
                case 'date':
                    input = {
                        block: 'input',
                        mods: {
                            'has-calendar': true,
                            size: 'm',
                            theme: 'islands',
                            width: 'available'
                        },
                        name: item.name,
                        weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                        months: ['Январь', 'Февраль', 'Март',
                            'Апрель', 'Май', 'Июнь',
                            'Июль', 'Август', 'Сентябрь',
                            'Октябрь', 'Ноябрь', 'Декабрь']
                    }
                    break;
                default:
                    input = {
                        block: 'input',
                        mods: {
                            type: item.mods.type,
                            theme: 'islands',
                            width: 'available',
                            size: 'm'
                        },
                        mix: {
                            elem: 'control'
                        },
                        required: item.required,
                        val: item.val,
                        name: item.name,
                        maxLenght: item.mods.maxLenght
                    }
                    break;
            }
        }

        if(!item.hidden)
            _item = {
                elem: 'row',
                content: [
                    {
                        elem: 'cell',
                        content: {
                            elem: 'label',
                            content: item.desc
                        }
                    },
                    {
                        elem: 'cell',
                        mix: (item.required)?{block: 'ultra-form',elem: 'required'}:{},
                        content: input
                    }
                ]
            };

        if(item.val == null && item.disabled) {
            _item = undefined;
        }

        return _item;
    })

    if(this.ctx.escapeButton === undefined)
        ret.push({
                elem: 'row',
                content: {
                    elem: 'cell',
                    content: {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            type: 'submit'
                        },
                        mix: {
                            block: 'button',
                            elem: 'create'
                        },
                        text: this.ctx.text
                    }
                }

            });

    if(this.ctx.escapeButton)
        ret.push({
                elem: 'row',
                content: {
                    elem: 'cell',
                    content: {
                        block: 'button',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            type: 'submit'
                        },
                        mix: {
                            block: 'button',
                            elem: 'create'
                        },
                        text: this.ctx.text
                    }
                }

            });

    return ret;

})

block('ultra-form').wrap()(function () {
    return {
        block: 'ultra-form',
        elem: 'wrap',
        content: this.ctx
    };
})
