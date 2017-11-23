block('navigator').elem('link')(
    mix()(function() {
        var ctx = this.ctx;
        
        if(ctx.float == 'right') {
            return 'navigator__link_float_right';
        } else return {};
    })
)
