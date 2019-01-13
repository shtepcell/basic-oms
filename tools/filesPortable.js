const Order = require('../server/models/Order');
const fs = require('fs');

function ID() {
    return Math.random().toString(36).substr(2, 9);
};

function generatePath(id) {
    var _dir;

    for (var i = 0; i < 1000; i++) {
        if (id > i * 1000) {
            _dir = `${(i) * 1000}-${(i + 1) * 1000}`;
        }
    }

    return `static/files/${_dir}/${id}/`;               
}

function getFileName(path) {
    const splited = path.split('/');

    return splited[splited.length - 1];
}

function checkPath(path) {
    const mustBeDocs = path.substr(0, 5);

    return (mustBeDocs == '/docs');
}

(async() => {
    const query = {
        $or: [
            { "info.file-init": {$ne: null} },
            { "info.order": {$ne: null} }
        ]
    }
    const orders = await Order.find(query);

    for (let index = 0; index < orders.length; index++) {
        const order = orders[index];
        
        if (order.info.order) {
            if(order.isOld && checkPath(order.info.order)) {
                const path = order.info.order;
                const fileName = getFileName(path);
                const newPath = `static/storage/${fileName}`;
                fs.rename('static/files' + path, newPath, (err) => {
                    if (err) {
                        console.log(`Error ${path} ${order.id}`);
                        order.info.order = null;
                        order.save();
                        return;
                    }
                    order.info.order = fileName;
                    order.save();
                })
            } else {
                const fileName = order.info.order;
                const path = generatePath(order.id) + fileName;

                fs.rename(path, `static/storage/${fileName}`, (err) => {
                    if (err) {
                        console.log(`Error ${path} ${order.id}`);
                        return;
                    }
                })
            }
        }

        if (order.info['file-init']) {
            const fileName = order.info['file-init'];
            const path = generatePath(order.id) + fileName;

            fs.rename(path, `static/storage/${fileName}`, (err) => {
                if (err) {
                    console.log(`Error ${path} ${order.id}`);
                    return;
                }
            })
        }
    }
})();