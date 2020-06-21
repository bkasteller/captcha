module.exports = function (req, res, next)
{
    let User = require('../models/user')

    const { userId } = req.session

    if (userId)
    {
        User.find(userId, (user) => {
            res.locals.user = user
        })
    }

    next()
}
