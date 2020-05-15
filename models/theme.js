let connection = require('../config/db')

class Theme {

    constructor (row) {
        this.row = row
    }

    get id () {
        return this.row.id
    }

    get name () {
        return this.row.name
    }

    static create (name, callback) {
        connection.query('INSERT INTO themes SET name = ?', [name], (err, result) => {
            if (err) throw err
            callback(result)
        })
    }

    static all (callback) {
        connection.query('SELECT * FROM themes ORDER BY name', (err, rows) => {
            if (err) throw err
            callback(rows.map((row) => new Theme(row)))
        })
    }

    static find (id, callback) {
        connection.query('SELECT * FROM themes WHERE id = ? LIMIT 1', [id], (err, rows) => {
            if (err) throw err
            callback(new Theme(rows[0]))
        })
    }

}

module.exports = Theme
