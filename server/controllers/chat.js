'use strict';

const Chat = require('../models/Chat'),
    Render = require('../render'),
    render = Render.render,
    common = require('./common');

module.exports = {

    get: async (req, res) => {
        var chat = await Chat.find({anchor: req.params.anchor}).populate('author');

        chat = chat.map( item => {
            return {
                author: item.author.name,
                text: item.text,
                time: common.dateToExtStr(item.time)
            }
        });

        res.send(chat);
    },

    send: async (req, res) => {
        var data = req.body;

        var isFirst = await Chat.find({anchor: req.params.anchor});
        isFirst = (isFirst.length == 0);

        var msg = new Chat({
            author: res.locals.__user,
            text: data.text,
            anchor: req.params.anchor,
            time: new Date()
        });

        var done = await msg.save();
        var _msg = {
            author:  res.locals.__user.name,
            text: done.text,
            time: common.dateToExtStr(done.time),
            isFirst: isFirst
        }

        res.status(200).send(_msg);
    }
}
