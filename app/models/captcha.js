let connection  = require('../../config/db'),
    Theme       = require('../models/theme'),
    User        = require('../models/user')

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

    get url () {
        return this.row.url
    }

    get theme_id () {
        return this.row.theme_id
    }

    get user_id () {
        return this.row.user_id
    }

    static create (name, theme_id, user_id, callback) {
        let url = "/captcha/" + name + user_id
        connection.query('INSERT INTO captcha SET name = ?, url = ?, theme_id = ?, user_id = ?', [name, url, theme_id, user_id], (err, result) => {
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

    static search (theme_id, user_id, callback) {
        connection.query('SELECT * FROM captcha WHERE theme_id LIKE ? AND user_id LIKE ?', [theme_id, user_id], (err, rows) => {
            if (err) throw err
            callback(rows.map((row) => new Captcha(row)))
        })
    }

    static update (captcha, name, theme, callback) {
        let query = 'UPDATE captcha SET'
        query += name && name != captcha.name ? ' name = ?, url = ?,' : ''
        query += theme && theme != captcha.theme ? ' theme_id = ?,' : ''
        query = query.slice(0, -1)
        query += ' WHERE id = ?'

        let array = []
        if (name && name != captcha.name) {
            array.push(name)
            let url = "/captcha/" + name + captcha.user_id
            array.push(url)
            let path = "public"
            require('fs').renameSync( path + captcha.url, path + url )
        }
        if (theme && theme != captcha.theme) array.push(theme)
        array.push(captcha.id)

        connection.query(query, array, (err, result) => {
            if (err) throw err
            callback(result)
        })
    }

    static delete (id, callback) {
        connection.query('DELETE FROM captcha WHERE id = ?', [id], (err, result) => {
            if (err) throw err
            callback(result)
        })
    }

}

module.exports = Captcha
