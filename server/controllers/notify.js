const helper = require('./helper'),
    Notify = require('../models/Notify'),
    Account = require('../models/Account'),
    Department = require('../models/Department'),

    Render = require('../render'),
    render = Render.render,

    { sendMail } = require('./mailer'),

    events = require('../common-data').notifies;

module.exports = {
    get: async (req, res) => {
        var user = await Account.findOne({_id: res.locals.__user._id})
                                .populate('notifies');

        res.locals.notifies = user.notifies.map( i => {
            i.text = events[i.text];

            if(i.read.indexOf(user._id) < 0) {
                i.isNew = true;
            }

            i.strDate = helper.dateToChatStr(i.date);

            return i;
        });

        render(req, res, {
            viewName: 'notifies'
        });

        for (var i = 0; i < user.notifies.length; i++) {
            var ntf = await Notify.findOne({_id: user.notifies[i]._id});
            if(ntf.read.indexOf(user._id) < 0) {
                ntf.read.push(user._id);
                ntf.save();
            }
        }
    },

    create: async (user, order, type, recipients) => {

        var ntf = new Notify({
            order: order.id,
            initiator: user.login,
            text: type,
            date: new Date()
        });

        ntf = await ntf.save();

        var b2o = await Department.findOne({ type: 'b2o' }),
            sks = await Department.findOne({ type: 'sks' }),
            net = await Department.findOne({ type: 'net' });

        var worker = [];

        switch (type) {
            case "start-gzp-pre":
            case "start-gzp-build":
            case "start-install-devices":
            case "start-build-shutdown":
                var gus;
                if (order.special) {
                    gus = await Department.findOne({_id: order.special});
                } else {
                    if (order.info.service == 'rrl') {
                        gus =  await Department.findOne({ type: 'rrl' });
                    } else {
                        gus = await Department.findOne({ cities: order.info.city });
                    }
                }
                if (gus) {
                    worker = await Account.find({ department: gus });
                }
                break;

            case "change-params":
              if (order.status == 'gzp-pre' || order.status == 'gzp-build' || order.status == 'install-devices') {
                var gus = await Department.findOne({ cities: order.info.city });
                if(order.special) gus = await Department.findOne({_id: order.special});
                worker = await Account.find({ department: gus });
              }
              if (order.staus == 'network') {
                worker = await Account.find({department: net});
              }
              break;

            case "start-stop-pre":
            case "start-stop-shutdown":
            case "start-stop-pause-service":
                worker = await Account.find({ department: b2o });
                break;

            case "start-sks-pre":
                worker = await Account.find({ department: sks });
                break;

            case "end-stop-build":
            case "end-gzp-build":
            case "end-sks-build":
            case "end-install-devices":
            case "start-pre-shutdown":
            case "start-pause-service":
                worker = await Account.find({department: net});
                break;

            case "network":
            case "end-stop-pre":
            case "end-gzp-pre":
            case "end-sks-pre":
            case "shutdown":
            case "pause-service":
                worker = await Account.find({ _id: order.info.initiator });
                break;

            case "new-message":
                if(recipients) {
                    recipients = recipients.map( item => {
                        if(item == 'initiator') return { _id: order.info.initiator };
                        else return { login: item };
                    });
                    worker = await Account.find({ $or: recipients });
                }
                break;
        }

        for (var i = 0; i < worker.length; i++) {
            worker[i].notifies.unshift(ntf);
            try {
                await worker[i].save();
            } catch (err) {
                console.error(err);
            }
        }

        sendMail(order, worker, type);

        return;

    },

    read: async (req, res) => {

    }
}
