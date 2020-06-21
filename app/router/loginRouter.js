module.exports = {
    get: (request, response) => {
        response.render('auth/login')
    },
    post: (request, response) => {
        const { email, password } = request.body

        if (email && password)
        {
            let User = require('../models/user')

            User.getUserByEmail(email, async (user) => {
                if (await require('bcrypt').compare(request.body.password, user.password))
                {
                    request.session.userId = user.id
                    request.flash('success', "Vous êtes connecté.")
                    response.redirect('/')
                }
                else
                {
                    request.flash('error', "Echec de l'authentification.")
                    response.redirect('/login')
                }
            })
        }
    }
}
