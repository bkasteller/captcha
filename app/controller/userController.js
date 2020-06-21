module.exports = {
    show: (request, response) => {
        let User = require('../models/user')

        User.all((users) => {
            response.render('users/show', {users: users})
        })
    },

    find: (request, response) => {
        let User = require('../models/user')

        User.find(request.params.id, (usr) => {
            if (usr.row !== undefined)
            {
                response.render('users/user', {usr: usr})
            }
            else
            {
                response.redirect('/users')
            }
        })
    },

    delete: (request, response) => {
        let User = require('../models/user')

        User.delete(request.params.id, (result) => {
            request.flash('success', "Suppression réussie.")
            response.redirect('/users')
        })
    },

    update: (request, response) => {
        let User = require('../models/user')

        User.find(request.body.id, async (user) => {
            try {
                let password = request.body.password ? await require('bcrypt').hash(request.body.password, 10) : null

                User.update(user, request.body.name, request.body.email, password, request.body.status, (result) => {
                    request.flash('success', "L'utilisateur a bien été modifié.")
                    response.redirect('/users/' + request.body.id)
                })
            }
            catch
            {
                request.flash('error', "Erreur lors de la modification.")
                response.redirect('/users/' + request.body.id)
            }
        })
    }
}
