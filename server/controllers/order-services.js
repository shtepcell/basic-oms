module.exports = {

    validateService: (info, files, old = {}) => {
        const service = info.service;
        const mustUpload = [];
        switch (service) {
            case 'sks':
                if (!old.schema && !files.schema) {
                    return { error: "Загрузите схему!" };
                }
                mustUpload.push('schema');

                if (!old.objectPhoto && !files.objectPhoto) {
                    return { error: "Загрузите фото объекта!" };
                }
                mustUpload.push('objectPhoto');

                if (!info.countOfPorts || info.countOfPorts == '') {
                    return { error: "Укажите количество рабочих мест/портов!" };
                }

                break;
            
            case 'devices':
                if (!info.countOfUtits || info.countOfUtits == '') {
                    return { error: "Укажите количество Unit-мест!" };
                }

                if (!info.powerConsumption || info.powerConsumption == '') {
                    return { error: "Укажите количество потребляемой мощности!" };
                }
                
                if (info.connetionNeed == 'Да' && !old.confirmDocument && !files.confirmDocument) {
                    return { error: "Загрузите документ!" };
                }

                if (info.connetionNeed == 'Да') {
                    mustUpload.push('confirmDocument');
                }
                break;

            case 'vibe':
                if (!old.schema && !files.schema) {
                    return { error: "Загрузите схему!" };
                }
                mustUpload.push('schema');

                if (!old.objectPhoto && !files.objectPhoto) {
                    return { error: "Загрузите фото объекта!" };
                }
                mustUpload.push('objectPhoto');
                break;
            
            case 'e1':
                if (!info.e1Stream || info.e1Stream == '') {
                    return { error: "Укажите количество поток E1!" };
                }

                if (!info.countOfConnectionLine || info.countOfConnectionLine == '') {
                    return { error: "Укажите количество соединительных линий!" };
                }
                break;

            case 'sip':
                if (!info.countOfLines || info.countOfLines == '') {
                    return { error: "Укажите количество линий!" };
                }

                if (!info.countOfNumbers || info.countOfNumbers == '') {
                    return { error: "Укажите количество номеров!" };
                }

                if (!info.typeOfClient || info.typeOfClient == '') {
                    return { error: "Укажите тип АТС клиента!" };
                }
                break;

            case 'wifiorg':
                if (!old.schema && !files.schema) {
                    return { error: "Загрузите схему!" };
                }
                mustUpload.push('schema');

                if (!old.objectPhoto && !files.objectPhoto) {
                    return { error: "Загрузите фото объекта!" };
                }
                mustUpload.push('objectPhoto');
                break;

            case 'safe':
                if (info.useDefaultBlackList == 'Нет' && !old.blackListFile && !files.blackListFile) {
                    return { error: "Загрузите список нежелательного контента!" };
                }
                if (info.useDefaultBlackList == 'Нет') {
                    mustUpload.push('blackListFile');
                }
                
                break;

            default:
                break;
        }

        return {mustUpload: mustUpload};
    }

}