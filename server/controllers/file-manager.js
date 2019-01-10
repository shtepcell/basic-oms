const fs = require('fs');

module.exports = {

    saveFile: (file) => {
        if (!file && !file.name && !file.data) {
            return null;
        }
        const ext = file.name.split('.').pop();
        let fileName = file.name.substr(0, file.name.length - ext.length - 1);
        
        fileName = fileName + '_' + ID() + '.' + ext;

        const url = `static/storage/${fileName}`;

        fs.writeFile(url, file.data, (err) => {
            if (err) throw err;
        });

        return fileName;
    }
    
}


function ID() {
    return Math.random().toString(36).substr(2, 9);
};