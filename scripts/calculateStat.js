const fs = require('fs');
const path = require('path');

// const { sendErrorTelegramMessage } = require('../lib/telegram');
const { getStat } = require('../server/controllers/order');

const errorHandler = async (error) => {
    console.log('Ошибка при расчете статистики СУЗ', error)
    // await sendErrorTelegramMessage('Ошибка при расчете статистики СУЗ', error);

    process.exit(1)
}

process.on('unhandledRejection', errorHandler);

(async () => {
    try {
        const stat = await getStat();
        fs.writeFileSync(path.resolve('cache/status.json'), JSON.stringify(stat));
        process.exit(0);
    } catch (err) {
        await errorHandler(err);
    }
})();
