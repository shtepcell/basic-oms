module.exports = {

    dateToStr: function (value) {
        var year = value.getFullYear();
        var month = value.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }
        var day = value.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        return `${day}-${month}-${year}`;
    },

    dateToExtStr: function (value = new Date()) {
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
        return `${this.dateToStr(value)} ${hour}:${min}:${sec}`;
    },

    strToDate: function (date) {
        if(date) {
            date = date.split('.');
            if(date.length == 3) {
                if(date[1] >= 0 && date[1] <= 11 && date[0] > 0 &&  date[0] <= 31)
                    return new Date(date[2], date[1]-1, date[0]);
                else return false
            } else return false;
        } else return null;
    },

    parseDate: (date) => {
        date = date.split('.');
        if(date.length == 3) {
            if(date[1] >= 0 && date[1] <= 11 && date[0] > 0 &&  date[0] <= 31)
                return new Date(date[2], date[1]-1, date[0]);
            else return false
        } else return false;
    }
};
