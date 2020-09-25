block('root').replace()(function() {
    var ctx = this.ctx,
        data = this.data = ctx.data,
        meta = data.meta || {},
        og = meta.og || {};

    if (ctx.context) return ctx.context;

    const bundle = data.view.slice(5, data.view.length);

    return {
        block: 'page',
        title: data.title,
        favicon: '/favicon.ico',
        styles: [
            {
                elem: 'css',
                url: `/${bundle}.min.css`
            }
        ],
        scripts: [
            {
                elem: 'js',
                url: 'https://browser.sentry-cdn.com/5.24.2/bundle.tracing.min.js',
                attrs: {
                    integrity: "sha384-Epltozh7S1cJM2hcIRDJBbqiiVpZsNlFCciHxKIAfKN8mSTa+gMivtz7glp/30Mz",
                    crossorigin: 'anonymous'
                }
            },
            {
                elem: 'js',
                url: '/socket.io.js'
            },
            {
                elem: 'js',
                url: `/${bundle}.min.js`
            },
        ],
        head: [
            { elem: 'meta', attrs: { name: 'description', content: meta.description } },
            { elem: 'meta', attrs: { property: 'og:title', content: og.title || data.title } },
            { elem: 'meta', attrs: { property: 'og:url', content: og.url } },
            { elem: 'meta', attrs: { property: 'og:site_name', content: og.siteName } },
            { elem: 'meta', attrs: { property: 'og:locale', content: og.locale || 'en_US' } },
            { elem: 'meta', attrs: { property: 'og:type', content: 'website' } },
            { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1' } }
        ],
        mods: {
            theme: 'islands',
            view: data.view
        }
    };
});
