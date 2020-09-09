const fs = require('fs');
const path = require('path');

const { getStat } = require('../server/controllers/order');

(async () => {
    const stat = await getStat();

    fs.writeFileSync(path.resolve('cache/status.json'), JSON.stringify(stat));

    process.exit(0);
})();