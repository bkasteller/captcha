let connection = require('../config/db')

async function crypt (string, cb)
{
    let cryptedString = await require('bcrypt').hash(string, 10)
    cb(cryptedString)
}

crypt('adminpassword', (password) => {
    let req = "INSERT INTO users (id, name, email, password, status) VALUES(1, 'superAdmin', 'super@admin.fr', '" + password + "', 'administrateur');"

    connection.query(req, (err, res) => {
        if (err) throw err
    })

    req = "INSERT INTO captcha (id, name, url, theme_id, user_id) VALUES(1, 'captcha', '/captcha/captcha', 1, 1);"

    connection.query(req, (err, res) => {
        if (err) throw err
    })

    connection.end();
})
