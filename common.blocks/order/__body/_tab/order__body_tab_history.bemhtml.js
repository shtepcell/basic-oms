block('order').elem('body').elemMod('tab', 'history').content()(function () {

    var ctx = this.ctx,
        tab = ctx.tab,
        dataset = ctx.dataset,
        user = ctx.user,
        order = ctx.order;

    var ret = [];

    var dateToStr = function (value) {
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = value.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        return `${day}.${month}.${year}`;
    }

    var dateToExtStr = function (value = new Date()) {
        var hour = value.getHours();
        if(hour < 10) {
            hour = '0' + hour;
        }
        var min = value.getMinutes();
        if(min < 10) {
            min = '0' + min;
        }
        var sec = value.getSeconds();
        if(sec < 10) {
            sec = '0' + sec;
        }
        return `${dateToStr(value)} ${hour}:${min}:${sec}`;
    }

    if(!order.history) {
        return [];
    }

    ret = order.history.map( item => {
        return {
            elem: 'body-row',
            content: [
                {
                    elem: 'body-row-name',
                    content: `${item.name}`
                },
                {
                    elem: 'body-row-name',
                    mix: {
                        elem: 'body-date'
                    },
                    content: `${dateToExtStr(item.date)}`
                },
                {
                    elem: 'body-row-name',
                    content: `[${item.author.department.name}] ${item.author.name} `
                }
            ]
        }
    })
    return ret;
})
