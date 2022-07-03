const Account = require('../../models/Account');
const { setPriority } = require('../priority');

const changePriority = (priority) => async (ids, author) => {
    const user = await Account.findById(author._id).populate('department');

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];

        await setPriority(id, priority, user);
    }
}

const increasePriority = changePriority(true);
const decreasePriority = changePriority(false);

module.exports = { increasePriority, decreasePriority };
