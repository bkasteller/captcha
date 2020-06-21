module.exports = {
    get: (request, response) => {
        let Theme = require('../models/theme')

        Theme.all((themes) => {
            response.render('pages/form', {themes: themes})
        })
    },
    post: async (request, response) => {
        try {
            if (!request.file) {
                request.flash('error', "Aucun fichier.")
                response.redirect('/formulaire')
            }
            let Captcha = require('../models/captcha')
            Captcha.create(request.body.name, request.body.theme_id, request.session.userId, (result) => {
                request.flash('success', "Captcha ajouté.")
                Captcha.find(result.insertId, (captcha) => {
                    require('fs').mkdir("public" + captcha.url, (e) => {
                        /*Object.keys(files).forEach((key) => {
                          let file = files[key]
                          renameZip(file, join("public" + captcha.url, file.name))
                      })*/
                    })
                    response.redirect('/packages/' + captcha.id + '/indices')
                })
            })
        } catch {
            response.redirect('/')
        }
    }
}

function renameZip(file, newpath) {
  let oldpath = file.path;
  fs.renameSync(oldpath, newpath);
}
