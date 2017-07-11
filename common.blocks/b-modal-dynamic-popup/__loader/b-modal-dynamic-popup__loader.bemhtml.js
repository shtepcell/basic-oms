block('b-modal-dynamic-popup').elem('loader')
    .content()(function() {
        return [
            {
                elem: 'loader-wrapper',
                content: {
                    elem: 'loader-cell',
                    content: {
                        block: 'spin',
                        mods: {
                            theme: 'islands',
                            size: 'm',
                            visible: true
                        },
                        mix: {
                            block: 'b-modal-dynamic-popup',
                            elem: 'spinner'
                        }
                    }
                }
            }
        ]
    });
