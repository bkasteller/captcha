let connection = require('../config/db')

class Captcha {

    constructor (row) {
        this.row = row
    }

    get id () {
        return this.row.id
    }

    get name () {
        return this.row.name
    }

    static create (name, theme_id, callback) {
        connection.query('INSERT INTO captcha SET name = ?, theme_id = ?', [name, theme_id], (err, result) => {
            if (err) throw err
            callback(result)
        })
    }

    static all (callback) {
        connection.query('SELECT * FROM captcha', (err, rows) => {
            if (err) throw err
            callback(rows.map((row) => new Captcha(row)))
        })
    }

    static find (id, callback) {
        connection.query('SELECT * FROM captcha WHERE id = ? LIMIT 1', [id], (err, rows) => {
            if (err) throw err
            callback(new Captcha(rows[0]))
        })
    }

}

module.exports = Captcha
