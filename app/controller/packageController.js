module.exports = {
    show: (request, response) => {
        let Captcha = require('../models/captcha')

        Captcha.find(request.params.id, (package) => {
            let Theme = require('../models/theme')

            Theme.all((themes) => {
                response.render('packages/show', {package: package, themes: themes})
            })
        })
    },

    update: (request, response) => {
        let Captcha = require('../models/captcha')

        Captcha.find(request.body.id, (captcha) => {
            Captcha.update(captcha, request.body.name, request.body.theme, (result) => {
                request.flash('success', "Le captcha a bien été modifié.")
                response.redirect('/packages/' + request.body.id)
            })
        })
    },

    delete: (request, response) => {
        let Captcha = require('../models/captcha')

        Captcha.delete(request.params.id, (result) => {
            request.flash('success', "Suppression réussie.")
            response.redirect('/')
        })
    }
}
