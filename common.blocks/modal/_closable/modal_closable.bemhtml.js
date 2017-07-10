block('modal').mod('closable', true).elem('content').content()(function() {
    return [
        applyNext(),
        {
            elem: 'close-icon',
            content: 'close!'
        }
    ];
});

block('modal').mod('closable', true).elem('close-icon').replace()(function() {
    return {
        block: 'icon',
        mix: {
            block: 'modal',
            elem: 'close-icon'
        }
    }
});