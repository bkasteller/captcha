module.exports = {
    create: (request, response) => {
        let data = request.body,
            name = "indices.json",
            content = "{"
        for (item in request.body) {
            if (item !== "id" && item !== "url") {
                content += '"' + item + '" : "' + request.body[item] + '",'
            }
        }
        content = content.slice(0, -1)
        content += "}"
        require('fs').writeFileSync("public" + request.body.url + "/" + name, content, () => {
            request.flash('success', "Indices mis à jour.")
            response.redirect('/packages/' + request.body.id + '/indices')
        })
    },

    show: (request, response) => {
        let Captcha = require('../models/captcha')
        let fileName = "/indices.json"

        Captcha.find(request.params.id, (package) => {
            let data = JSON.parse(require('fs').readFileSync('public' + package.url + fileName, 'utf8'))
            response.render('indices/show', {package: package, data: data})
        })
    }
}
