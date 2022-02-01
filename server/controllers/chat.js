'use strict';

const Chat = require('../models/Chat'),
    Render = require('../render'),
    Order = require('../models/Order'),

    render = Render.render,
    notify = require('./notify'),
    helper = require('./helper');

var populateClient = {
        path: 'info.client',
        select: 'name type',
        populate: {
            path: 'type',
            select: 'shortName name'
        },
        options: {
            lean: true
        }
    }

module.exports = {

    get: async (req, res) => {
        var chat = await Chat.find({anchor: req.params.anchor}).populate('author');

        chat = chat.map( item => {
            return {
                author: item.author.name,
                mine: (item.author._id+'' == res.locals.__user._id),
                text: item.text,
                time: helper.dateToChatStr(item.time)
            }
        });

        res.send(chat);
    },

    send: async (req, res, io) => {
        var data = req.body;

        var isFirst = await Chat.find({anchor: req.params.anchor});
        isFirst = (isFirst.length == 0);

        var order = await Order.findOne({id: req.params.anchor})
                                .populate(populateClient)
                                .lean();

        var msg = new Chat({
            author: res.locals.__user,
            text: data.text,
            anchor: req.params.anchor,
            time: new Date()
        });

        var done = await msg.save();
        var _msg = {
            author:  res.locals.__user.name,
            anchor: req.params.anchor,
            text: done.text,
            time: helper.dateToChatStr(done.time),
            isFirst: isFirst
        }
        notify.create(res.locals.__user, order, 'new-message', data.recipients);
        io && io.emit('new message', _msg);
        res.status(200).send(_msg);
    }
}
