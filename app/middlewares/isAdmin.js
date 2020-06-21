module.exports = function (req, res, next)
{
    let User = require('../models/user')

    User.find(req.session.userId, (user) => {
        if (user.isAdmin)
        {
            next()
        }
        else
        {
            res.redirect('/')
        }
    })
}
