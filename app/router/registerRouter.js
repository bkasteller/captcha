module.exports = {
    get: (request, response) => {
        response.render('auth/register')
    },
    post: async (request, response) => {
        try
        {
            let User = require('../models/user')

            let password = await require('bcrypt').hash(request.body.password, 10)

            User.create(request.body.name, request.body.email, password, () => {
                request.flash('success', "Votre compte a bien été crée.")
                response.redirect('/login')
            })
        }
        catch
        {
            request.flash('error', "Erreur lors de la création du compte.")
            response.redirect('/register')
        }
    }
}
