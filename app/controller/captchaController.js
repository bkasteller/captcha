module.exports = {
    show: (request, response) => {
        let Captcha = require('../models/captcha')

        Captcha.find(1, (captcha) => {
            response.render('pages/captcha', {
                data: JSON.parse(require('fs').readFileSync('public' + captcha.url + '/indices.json', 'utf8')),
                captcha
            })
        })
    }
}
