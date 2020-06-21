module.exports = {
    index: (request, response) => {
        let Captcha = require('../models/captcha'),
            User    = require('../models/user'),
            Theme   = require('../models/theme')

        let theme_id = request.body.theme_id === undefined ? "%" : request.body.theme_id
        let user_id = request.body.user_id === undefined ? "%" : request.body.user_id

        Captcha.search(theme_id, user_id, (packages) => {
            User.all((users) => {
                Theme.all((themes) => {
                    response.render('pages/index', {packages: packages, selected_theme: theme_id, selected_user: user_id, users: users, themes: themes})
                })
            })
        })
    }
}
