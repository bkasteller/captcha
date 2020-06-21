module.exports = {
    show: (request, response) => {
        let Theme = require('../models/theme')

        Theme.all((themes) => {
            response.render('themes/show', {themes: themes})
        })
    },

    delete: (request, response) => {
        let Theme = require('../models/theme')

        Theme.delete(request.params.id, (result) => {
            request.flash('success', "Suppression réussie.")
            response.redirect('/themes')
        })
    },

    create: (request, response) => {
        try
        {
            let Theme = require('../models/theme')

            Theme.create(request.body.name, (result) => {
                request.flash('success', "Création réussie.")
                response.redirect('/themes')
            })
        }
        catch
        {
            request.flash('error', "Erreur lors de la création du thème.")
            response.redirect('/themes')
        }
    }
}
