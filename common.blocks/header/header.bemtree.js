block('header').content()(function() {
    const user = this.data.locals.__user;
    const deps = this.data.locals.__deps;

    if (!user) {
        return {
            block: 'header',
            elem: 'hello',
            content: 'Система управления заказами v2.0'
        }
    }

    return {
        block: 'navigator',
        user: user,
        deps: deps
    };
});