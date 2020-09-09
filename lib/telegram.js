require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.ALERT_CHAT_ID;

const bot = new TelegramBot(token);

const sendErrorTelegramMessage = (message, error) => {
    return bot.sendMessage(chatId, `*CRIT: ${message}*\n\n${error ? error.toString() : 'Unknown Eror'}`,  { parse_mode: 'Markdown' });
}

module.exports = { sendErrorTelegramMessage }