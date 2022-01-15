const Order = require('../models/Order');
const Request = require('../models/Request');
const { closeOrder } = require('./mass-update/closeOrder');

const populateAuthor = {
    path: 'author',
    select: 'login',
    options: {
        lean: true
    }
}

const validate = async({ ids, action, confirm }) => {
    const errorsIds = [];
    const orderIds = [...new Set(ids.split(/ /).map(item => item.trim()).filter(Boolean))];
    const errors = {};
    const orders = await Order.find({ $or: orderIds.map(id => ({ id })) }).lean();

    if (orderIds.length !== orders.length) {
        const notFounded = [];

        orderIds.forEach(id => {
            if (!orders.some((order) => id == order.id)) {
                notFounded.push(id);
            } 
        })

        if (!confirm) {
            errors.notFounded = notFounded;
        } else {
            errorsIds.push(...notFounded);
        }
    }

    const notNeeded = await Order.find({ $or: orderIds.map(id => ({ id })), status: action }).select('id')

    if (notNeeded.length) {
        const noNeededIds = notNeeded.map(({ id }) => String(id));

        if (!confirm) {
            errors.notNeeded = noNeededIds;
        } else {
            errorsIds.push(...noNeededIds);
        }
    }

    const filteredIds = orderIds.filter(item => !errorsIds.includes(item));

    if (filteredIds.length === 0) {
        errors.nothingToChange = true;
    }

    if (errors.notFounded || errors.notNeeded || errors.nothingToChange) {
        return { errors };
    }

    return { ids: filteredIds, action }
}

const makeRequestToChange = async (req, res) => {
    const { ids, action, errors } = await validate(req.body);

    if (errors) {
        return res.status(400).json(errors);
    }

    if (ids && ids.length && action) {
        const request = new Request({
            orders: ids,
            action,
            author: res.locals.__user,
            created: Date.now(),
            status: 'new',
        });
        
        await request.save();

        return res.sendStatus(200);
    }
}

const updateRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status === 'rejected') {
        await Request.findOneAndUpdate({ _id: id }, { status: 'rejected' });

        return res.sendStatus(200);
    }

    if (status === 'aproved') {
        const request = await Request.findById(id).populate(populateAuthor);

        if (request.action === 'succes') {
            await closeOrder(request.orders, request.author.login);
        }

        request.status = 'closed';
        request.save();

        return res.sendStatus(200);
    }

    return res.sendStatus(400);
}

const getOwnRequests = async (user) => {
    const requests = await Request.find({ author: user, status: 'new' }).populate(populateAuthor).lean();

    return requests
}

const getOwnRequestsMiddleware = async(req, res, next) => {
    const requests = await getOwnRequests(res.locals.__user._id);

    res.locals.requests = JSON.parse(JSON.stringify(requests));

    next()
}

const getOwnRequestsApi = async(req, res) => {
    const requests = await getOwnRequests(res.locals.__user._id);

    return res.status(200).json(requests);
}

module.exports = {
    makeRequestToChange,
    getOwnRequests,
    updateRequest,
    getOwnRequestsMiddleware,
    getOwnRequestsApi,
}