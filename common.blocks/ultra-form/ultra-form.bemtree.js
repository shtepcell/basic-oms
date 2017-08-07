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
            if(item.mods.type === 'suggest')
                input = {
                    block : 'suggest',
                    mods : {
                        theme : 'islands',
                        size : 'm',
                        'has-dataprovider' : item.mods['has-dataprovider']
                    },
                    name: item.name,
                    dataprovider: item.dataprovider
                }
            else if(item.mods.type === 'select')
                input = {
                    block: 'select',
                    mods: {
                        mode: 'radio',
                        theme: 'islands',
                        size: 'm',
                    },
                    val: item.val,
                    options: item.data,
                    name: item.name
                }
            else input = {
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
                        content: input
                    }
                ]
            };
        return _item;
    })

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
